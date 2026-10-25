// Textos que se muestran en pantalla para los nombres de catálogo de la base.
const ETIQUETA_CATEGORIA: Record<string, string> = {
  INCENDIO: 'Incendio',
  SISMO: 'Sismo',
  INUNDACION: 'Inundación',
  ACCIDENTE_TRANSITO: 'Accidente vial',
  DESLIZAMIENTO: 'Deslizamiento',
  ROBO: 'Robo',
  EMERGENCIA_MEDICA: 'Emergencia médica',
  COLAPSO_ESTRUCTURAL: 'Colapso estructural',
  FUGA_GAS: 'Fuga de gas',
  OTROS: 'Otro',
};

// Etiquetas que no tienen categoría propia en la base
const CATEGORIA_DE_ETIQUETA: Record<string, string> = { 'Explosión': 'OTROS' };

const ICONO_CATEGORIA: Record<string, string> = {
  SISMO: '🌎', INCENDIO: '🔥', INUNDACION: '🌊', DESLIZAMIENTO: '⛰️', ACCIDENTE_TRANSITO: '🚗',
  ROBO: '⚠️', EMERGENCIA_MEDICA: '🚑', COLAPSO_ESTRUCTURAL: '🏚️', FUGA_GAS: '💨',
};

export function etiquetaCategoria(nombre: string): string {
  return ETIQUETA_CATEGORIA[nombre] ?? nombre;
}

/** Nombre en la base de una etiqueta de pantalla; hace lo contrario que etiquetaCategoria. */
export function nombreCategoria(etiqueta: string): string {
  const encontrada = Object.entries(ETIQUETA_CATEGORIA).find(([, valor]) => valor === etiqueta)?.[0];
  return encontrada ?? CATEGORIA_DE_ETIQUETA[etiqueta] ?? 'OTROS';
}

export function iconoCategoria(nombre: string): string {
  return ICONO_CATEGORIA[nombre] ?? '⚠️';
}

/** Texto de ubicación a partir de los campos opcionales de `ubicaciones`. */
export function textoUbicacion(u: { distrito?: string | null; provincia?: string | null; direccion?: string | null } | null | undefined): string {
  if (!u) return 'Ubicación no disponible';
  const zona = [u.distrito, u.provincia].filter(Boolean).join(', ');
  return u.direccion?.trim() || zona || 'Ubicación no disponible';
}
