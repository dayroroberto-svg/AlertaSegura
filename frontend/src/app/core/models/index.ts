// Tipos con la forma de las tablas en Postgres. El esquema está en supabase/.

export type NombreRol = 'ADMINISTRADOR' | 'CIUDADANO';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';
export type NombreNivelRiesgo = 'BAJO' | 'MODERADO' | 'ALTO' | 'CRITICO';
export type NombreEstadoReporte = 'PENDIENTE' | 'EN_REVISION' | 'VERIFICADO' | 'RECHAZADO' | 'ARCHIVADO';
export type NombreEstadoAlerta = 'ACTIVA' | 'EN_SEGUIMIENTO' | 'CONTROLADA' | 'FINALIZADA' | 'CANCELADA';
export type TipoNotificacion = 'ALERTA' | 'REPORTE' | 'SISTEMA';

export interface Perfil {
  id_usuario: number;
  auth_id: string;
  id_rol: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  distrito: string | null;
  preferencias: { notificaciones?: boolean[] };
  estado: EstadoUsuario;
  fecha_registro: string;
  ultima_conexion: string | null;
}

export interface Ubicacion {
  id_ubicacion: number;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  direccion: string | null;
  latitud: number | null;
  longitud: number | null;
  referencia: string | null;
}

export interface CategoriaEmergencia {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface NivelRiesgo {
  id_nivel: number;
  nombre: NombreNivelRiesgo;
  color: string | null;
  descripcion: string | null;
}

export interface Reporte {
  id_reporte: number;
  codigo_reporte: string;
  id_usuario: number;
  id_categoria: number;
  id_ubicacion: number;
  id_nivel: number;
  id_estado: number;
  titulo: string;
  descripcion: string | null;
  fecha_incidente: string | null;
  fecha_reporte: string;
  /** Ruta del archivo en el bucket privado `evidencias` (<auth_uid>/<archivo>). */
  evidencia_url: string | null;
  observaciones_admin: string | null;
  /** Revisión automática de la foto; solo es un aviso para el administrador. */
  ia_veredicto: 'COINCIDE' | 'DUDOSA' | 'NO_COINCIDE' | 'ERROR' | null;
  ia_confianza: number | null;
  ia_motivo: string | null;
  ia_analizado_en: string | null;
}

export interface Alerta {
  id_alerta: number;
  codigo_alerta: string;
  id_reporte: number | null;
  id_administrador: number;
  id_categoria: number;
  id_ubicacion: number;
  id_nivel: number;
  id_estado_alerta: number;
  titulo: string;
  descripcion: string | null;
  recomendaciones: string | null;
  fecha_publicacion: string;
  fecha_actualizacion: string | null;
  fecha_finalizacion: string | null;
}

export interface Notificacion {
  id_notificacion: number;
  id_usuario: number;
  id_alerta: number | null;
  titulo: string;
  mensaje: string | null;
  tipo: TipoNotificacion;
  leida: boolean;
  fecha_envio: string;
}

export interface ContactoEmergencia {
  id_contacto: number;
  id_tipo_contacto: number;
  nombre_institucion: string;
  telefono: string | null;
  direccion: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  descripcion: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface InformacionPrevencion {
  id_informacion: number;
  id_categoria_prevencion: number;
  titulo: string;
  antes: string | null;
  durante: string | null;
  despues: string | null;
  fecha_actualizacion: string | null;
}

// Filas con las relaciones que traen las consultas de DatosService
export type AlertaConRelaciones = Alerta & {
  categorias_emergencia: { nombre: string } | null;
  niveles_riesgo: { nombre: NombreNivelRiesgo; color: string | null } | null;
  estados_alerta: { nombre: NombreEstadoAlerta } | null;
  ubicaciones: Pick<Ubicacion, 'distrito' | 'direccion' | 'latitud' | 'longitud'> | null;
};

export type ReporteConEstado = Reporte & {
  estados_reporte: { nombre: NombreEstadoReporte } | null;
};

export type ContactoConTipo = ContactoEmergencia & {
  tipos_contacto: { nombre: string } | null;
};

export type InformacionConCategoria = InformacionPrevencion & {
  categorias_prevencion: { nombre: string } | null;
};
