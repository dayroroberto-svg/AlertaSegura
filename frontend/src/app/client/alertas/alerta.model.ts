export type NivelRiesgo = 'ALTO' | 'MODERADO' | 'BAJO';
export type EstadoAlerta = 'ACTIVA' | 'EN_SEGUIMIENTO' | 'CONTROLADA';

export interface Alerta {
  idAlerta: number;
  categoria: string;
  icono: string;
  descripcion: string;
  direccion: string;
  nivelRiesgo: NivelRiesgo;
  estado: EstadoAlerta;
  fechaPublicacion: string;
  recomendaciones: string[];
}

export interface FiltroAlertas {
  categoria: string;
  nivelRiesgo: NivelRiesgo | '';
}

export const ETIQUETA_RIESGO: Record<NivelRiesgo, string> = {
  ALTO: 'Alto riesgo',
  MODERADO: 'Riesgo medio',
  BAJO: 'Riesgo bajo',
};

export const ETIQUETA_ESTADO: Record<EstadoAlerta, string> = {
  ACTIVA: 'Activa',
  EN_SEGUIMIENTO: 'En seguimiento',
  CONTROLADA: 'Controlada',
};

export const CATEGORIAS_ALERTA = ['Sismo', 'Incendio', 'Inundación', 'Deslizamiento', 'Accidente vial'];
