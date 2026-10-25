// Revisa con Gemini si la foto de un reporte corresponde al tipo de emergencia declarado.
// El resultado es solo un aviso para el administrador: nunca rechaza el reporte.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { encodeBase64 } from "jsr:@std/encoding/base64";

// Modelo estable de Gemini con entrada de imágenes y nivel gratuito
const MODELO = "gemini-3.5-flash-lite";
const URL_GEMINI = "https://generativelanguage.googleapis.com/v1beta/interactions";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp"] as const;
type TipoImagen = (typeof TIPOS_IMAGEN)[number];

const SISTEMA = `Revisas las fotos que los ciudadanos adjuntan a reportes de emergencia en una plataforma de seguridad ciudadana del Perú.
Tu revisión es solo un aviso para el administrador, que toma la decisión final. Una emergencia real nunca debe quedar descartada por tu culpa.

Decide si la foto puede mostrar de verdad el tipo de emergencia declarado.
- COINCIDE: la foto muestra algo compatible con esa emergencia (humo o llamas en un incendio, agua acumulada en una inundación, daños en un sismo, vehículos chocados en un accidente, etc.).
- DUDOSA: no se puede saber, la foto no muestra la emergencia con claridad o parece de otro tipo de emergencia.
- NO_COINCIDE: claramente no es una foto real de la emergencia: meme, dibujo, captura de pantalla de un videojuego o de redes sociales, foto con marca de agua de un banco de imágenes, imagen generada por IA, o algo sin relación (una selfie, comida, una mascota).

Sé tolerante con fotos borrosas, de noche, tomadas con prisa o desde lejos: es normal en una emergencia. Si dudas entre COINCIDE y DUDOSA, elige DUDOSA; reserva NO_COINCIDE para casos claros.
El motivo va en español, en una o dos frases cortas que el administrador pueda leer de un vistazo.`;

const ESQUEMA = {
  type: "object",
  properties: {
    veredicto: { type: "string", enum: ["COINCIDE", "DUDOSA", "NO_COINCIDE"] },
    confianza: { type: "number", description: "De 0 a 1" },
    motivo: { type: "string" },
  },
  required: ["veredicto", "confianza", "motivo"],
  additionalProperties: false,
};

interface Resultado {
  veredicto: "COINCIDE" | "DUDOSA" | "NO_COINCIDE" | "ERROR";
  confianza: number | null;
  motivo: string;
}

function respuesta(cuerpo: unknown, estado = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function tipoDeImagen(tipo: string, ruta: string): TipoImagen {
  if ((TIPOS_IMAGEN as readonly string[]).includes(tipo)) return tipo as TipoImagen;
  if (ruta.endsWith(".png")) return "image/png";
  if (ruta.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

interface PasoGemini {
  type: string;
  content?: { type: string; text?: string }[];
}

async function preguntarAGemini(imagen: string, tipo: TipoImagen, emergencia: string, descripcion: string): Promise<Resultado> {
  const clave = Deno.env.get("GEMINI_API_KEY");
  if (!clave) throw new Error("Falta el secreto GEMINI_API_KEY");

  const res = await fetch(URL_GEMINI, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": clave },
    body: JSON.stringify({
      model: MODELO,
      system_instruction: SISTEMA,
      // No se guarda la interacción en Google
      store: false,
      input: [
        {
          type: "text",
          text: `Tipo de emergencia declarado: ${emergencia}\nDescripción del ciudadano: ${descripcion || "(sin descripción)"}`,
        },
        { type: "image", data: imagen, mime_type: tipo },
      ],
      response_format: { type: "text", mime_type: "application/json", schema: ESQUEMA },
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini respondió ${res.status}: ${await res.text()}`);
  }

  const interaccion = (await res.json()) as { status?: string; steps?: PasoGemini[] };
  if (interaccion.status !== "completed") {
    return { veredicto: "ERROR", confianza: null, motivo: "La IA no pudo revisar esta foto." };
  }
  const texto = (interaccion.steps ?? [])
    .filter((paso) => paso.type === "model_output")
    .flatMap((paso) => paso.content ?? [])
    .filter((parte) => parte.type === "text" && parte.text)
    .map((parte) => parte.text)
    .join("");
  if (!texto) {
    return { veredicto: "ERROR", confianza: null, motivo: "La IA no devolvió una respuesta." };
  }

  const datos = JSON.parse(texto) as { veredicto: Resultado["veredicto"]; confianza: number; motivo: string };
  if (!["COINCIDE", "DUDOSA", "NO_COINCIDE"].includes(datos.veredicto)) {
    return { veredicto: "ERROR", confianza: null, motivo: "La IA devolvió un veredicto inválido." };
  }
  return {
    veredicto: datos.veredicto,
    confianza: Math.min(1, Math.max(0, Number(datos.confianza))),
    motivo: String(datos.motivo).slice(0, 500),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return respuesta({ error: "Método no permitido" }, 405);

  const autorizacion = req.headers.get("Authorization");
  if (!autorizacion) return respuesta({ error: "Falta la sesión" }, 401);

  let idReporte: number;
  try {
    idReporte = Number((await req.json()).id_reporte);
  } catch {
    return respuesta({ error: "Cuerpo inválido" }, 400);
  }
  if (!Number.isInteger(idReporte)) return respuesta({ error: "id_reporte inválido" }, 400);

  // Se lee el reporte con la sesión de quien llama: RLS solo deja pasar al dueño o a un administrador
  const comoUsuario = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: autorizacion } },
  });
  const { data: reporte, error } = await comoUsuario
    .from("reportes")
    .select("id_reporte, descripcion, evidencia_url, categorias_emergencia(nombre)")
    .eq("id_reporte", idReporte)
    .maybeSingle();
  if (error || !reporte) return respuesta({ error: "Reporte no encontrado" }, 404);
  if (!reporte.evidencia_url) return respuesta({ veredicto: null, motivo: "El reporte no tiene foto." });

  // La foto y el resultado se manejan con la clave de servicio, que solo existe en el servidor
  const servicio = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let resultado: Resultado;
  try {
    const { data: archivo, error: errorDescarga } = await servicio.storage.from("evidencias").download(reporte.evidencia_url);
    if (errorDescarga || !archivo) throw new Error("No se pudo descargar la foto");
    const imagen = encodeBase64(new Uint8Array(await archivo.arrayBuffer()));
    const categoria = (reporte.categorias_emergencia as { nombre?: string } | null)?.nombre ?? "OTROS";
    resultado = await preguntarAGemini(imagen, tipoDeImagen(archivo.type, reporte.evidencia_url), categoria, reporte.descripcion ?? "");
  } catch (e) {
    console.error("analizar-evidencia", e);
    resultado = { veredicto: "ERROR", confianza: null, motivo: "No se pudo revisar la foto en este momento." };
  }

  await servicio
    .from("reportes")
    .update({
      ia_veredicto: resultado.veredicto,
      ia_confianza: resultado.confianza,
      ia_motivo: resultado.motivo,
      ia_analizado_en: new Date().toISOString(),
    })
    .eq("id_reporte", idReporte);

  return respuesta(resultado);
});
