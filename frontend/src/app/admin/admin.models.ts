export type NivelRiesgo = 'alto' | 'medio' | 'bajo';
export type EstadoReporte = 'revision' | 'verificado' | 'rechazado';
export type EstadoAlerta = 'activa' | 'finalizada' | 'archivada';

export interface Reporte {
  id: string;
  tipo: string;
  ubicacion: string;
  fecha: string;
  hora: string;
  gravedad: NivelRiesgo;
  estado: EstadoReporte;
  descripcion: string;
  ciudadano: string;
  latitud: number | null;
  longitud: number | null;
  /** Ruta de la foto en el bucket privado `evidencias`, o null si no hay foto. */
  evidencia: string | null;
  /** Revisión de la foto con IA, o null si todavía no se hizo. */
  ia: RevisionIa | null;
}

export interface RevisionIa {
  veredicto: 'COINCIDE' | 'DUDOSA' | 'NO_COINCIDE' | 'ERROR';
  confianza: number | null;
  motivo: string;
}

export interface Alerta {
  id: string;
  tipo: string;
  ubicacion: string;
  nivel: NivelRiesgo;
  fecha: string;
  hora?: string;
  estado: EstadoAlerta;
  titulo: string;
}

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  email: string;
  distrito: string;
  registro: string;
  activo: boolean;
  reportes: number;
}

export interface NuevaAlerta {
  titulo: string;
  tipo: string;
  ubicacion: string;
  descripcion: string;
  nivel: NivelRiesgo;
  fecha: string;
  hora: string;
  recomendaciones: string;
  estado: string;
  idReporte?: string;
}

export interface EstadisticaDashboard {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  bg: string;
}

export interface ActividadReciente {
  time: string;
  text: string;
  type: 'alto' | 'medio' | 'info';
}

export interface TipoEmergencia {
  tipo: string;
  pct: number;
  color: string;
  n: number;
}

export interface ResumenDashboard {
  fecha: string;
  estadisticas: EstadisticaDashboard[];
  reportesPorDia: { dia: string; valor: number }[];
  tiposEmergencia: TipoEmergencia[];
  actividad: ActividadReciente[];
}

export interface PinMapa {
  id: string;
  tipo: string;
  ubicacion: string;
  nivel: NivelRiesgo;
  latitud: number;
  longitud: number;
  desc: string;
}

export interface ConfiguracionAdmin {
  perfil: { nombre: string; cargo: string; telefono: string; organizacion: string; correo: string; rol: string };
  notificaciones: { label: string; desc: string; on: boolean }[];
  categorias: string[];
  sistema: { label: string; val: string }[];
}
