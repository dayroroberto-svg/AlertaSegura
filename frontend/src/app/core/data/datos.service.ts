import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../client/core/auth/auth.service';
import {
  AlertaConRelaciones,
  CategoriaEmergencia,
  ContactoConTipo,
  InformacionConCategoria,
  NivelRiesgo,
  Notificacion,
  Reporte,
  ReporteConEstado,
} from '../models';
import { supabase } from '../supabase/supabase.client';

const ESTADOS_VIGENTES = ['ACTIVA', 'EN_SEGUIMIENTO', 'CONTROLADA'];

const SELECT_ALERTA =
  '*, categorias_emergencia(nombre), niveles_riesgo(nombre, color), estados_alerta!inner(nombre), ubicaciones(distrito, direccion, latitud, longitud)';

export interface NuevoReporte {
  idCategoria: number;
  idNivel: number;
  titulo: string;
  descripcion?: string;
  fechaIncidente?: string;
  evidencia?: string | null;
  direccion?: string;
  latitud?: number | null;
  longitud?: number | null;
}

/** Consultas a Supabase que comparten varias pantallas. Si algo falla, lanza el error de Postgrest. */
@Injectable({ providedIn: 'root' })
export class DatosService {
  private readonly auth = inject(AuthService);

  async contactos(): Promise<ContactoConTipo[]> {
    const { data, error } = await supabase
      .from('contactos_emergencia')
      .select('*, tipos_contacto(nombre)')
      .eq('estado', 'ACTIVO')
      .order('id_contacto')
      .overrideTypes<ContactoConTipo[]>();
    if (error) throw error;
    return data;
  }

  async informacionPrevencion(): Promise<InformacionConCategoria[]> {
    const { data, error } = await supabase
      .from('informacion_prevencion')
      .select('*, categorias_prevencion!inner(nombre)')
      .eq('categorias_prevencion.estado', 'ACTIVO')
      .order('id_informacion')
      .overrideTypes<InformacionConCategoria[]>();
    if (error) throw error;
    return data;
  }

  /** Alertas públicas. Por defecto solo las vigentes, sin finalizadas ni canceladas. */
  async alertas(soloVigentes = true): Promise<AlertaConRelaciones[]> {
    let consulta = supabase.from('alertas').select(SELECT_ALERTA).order('fecha_publicacion', { ascending: false });
    if (soloVigentes) {
      consulta = consulta.in('estados_alerta.nombre', ESTADOS_VIGENTES);
    }
    const { data, error } = await consulta.overrideTypes<AlertaConRelaciones[]>();
    if (error) throw error;
    return data;
  }

  async alerta(idAlerta: number): Promise<AlertaConRelaciones | null> {
    const { data, error } = await supabase
      .from('alertas')
      .select(SELECT_ALERTA)
      .eq('id_alerta', idAlerta)
      .maybeSingle();
    if (error) throw error;
    return data as unknown as AlertaConRelaciones | null;
  }

  private categoriasEnCache?: Promise<CategoriaEmergencia[]>;
  private nivelesEnCache?: Promise<NivelRiesgo[]>;

  categorias(): Promise<CategoriaEmergencia[]> {
    this.categoriasEnCache ??= Promise.resolve(
      supabase.from('categorias_emergencia').select('*').order('id_categoria').overrideTypes<CategoriaEmergencia[]>(),
    ).then(({ data, error }) => {
      if (error) throw error;
      return data;
    });
    return this.categoriasEnCache;
  }

  niveles(): Promise<NivelRiesgo[]> {
    this.nivelesEnCache ??= Promise.resolve(
      supabase.from('niveles_riesgo').select('*').order('id_nivel').overrideTypes<NivelRiesgo[]>(),
    ).then(({ data, error }) => {
      if (error) throw error;
      return data;
    });
    return this.nivelesEnCache;
  }

  async misReportes(): Promise<ReporteConEstado[]> {
    const { data, error } = await supabase
      .from('reportes')
      .select('*, estados_reporte(nombre)')
      .eq('id_usuario', this.idUsuario())
      .order('fecha_reporte', { ascending: false })
      .overrideTypes<ReporteConEstado[]>();
    if (error) throw error;
    return data;
  }

  async misNotificaciones(): Promise<Notificacion[]> {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('id_usuario', this.idUsuario())
      .order('fecha_envio', { ascending: false })
      .overrideTypes<Notificacion[]>();
    if (error) throw error;
    return data;
  }

  /** Sube la foto al bucket privado y devuelve su ruta. */
  async subirEvidencia(archivo: File): Promise<string> {
    const { data: sesion } = await supabase.auth.getSession();
    const uid = sesion.session?.user.id;
    if (!uid) throw new Error('Sesión no válida');

    const extension = archivo.type === 'image/png' ? 'png' : archivo.type === 'image/webp' ? 'webp' : 'jpg';
    const ruta = `${uid}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('evidencias').upload(ruta, archivo, { contentType: archivo.type });
    if (error) throw error;
    return ruta;
  }

  async crearReporte(reporte: NuevoReporte): Promise<Reporte> {
    const { data, error } = await supabase
      .rpc('crear_reporte', {
        p_id_categoria: reporte.idCategoria,
        p_id_nivel: reporte.idNivel,
        p_titulo: reporte.titulo,
        p_descripcion: reporte.descripcion ?? null,
        p_fecha_incidente: reporte.fechaIncidente || null,
        p_evidencia_url: reporte.evidencia ?? null,
        p_direccion: reporte.direccion || null,
        p_latitud: reporte.latitud ?? null,
        p_longitud: reporte.longitud ?? null,
      })
      .single()
      .overrideTypes<Reporte>();
    if (error) throw error;
    if (!data) throw new Error('No se pudo crear el reporte');
    return data;
  }

  private idUsuario(): number {
    const id = this.auth.session()?.idUsuario;
    if (id === undefined) throw new Error('Sesión no válida');
    return id;
  }
}
