import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Alerta, EstadoAlerta, NivelRiesgo } from './alerta.model';
import { DatosService } from '../../core/data/datos.service';
import { etiquetaCategoria, iconoCategoria, textoUbicacion } from '../../core/data/etiquetas';
import { AlertaConRelaciones } from '../../core/models';

// Acceso a datos de las pantallas de alertas. Solo lee, y cualquiera puede verlas.
@Injectable({ providedIn: 'root' })
export class AlertasService {
  private readonly datos = inject(DatosService);

  listar(): Observable<Alerta[]> {
    return from(this.datos.alertas().then((filas) => filas.map((fila) => this.aAlerta(fila))));
  }

  obtener(idAlerta: number): Observable<Alerta | undefined> {
    return from(
      this.datos.alerta(idAlerta).then((fila) => {
        const alerta = fila ? this.aAlerta(fila) : undefined;
        // El ciudadano ya no ve las alertas finalizadas ni canceladas
        return alerta && ['ACTIVA', 'EN_SEGUIMIENTO', 'CONTROLADA'].includes(fila!.estados_alerta?.nombre ?? '') ? alerta : undefined;
      }),
    );
  }

  private aAlerta(fila: AlertaConRelaciones): Alerta {
    const categoria = fila.categorias_emergencia?.nombre ?? 'OTROS';
    const riesgo = fila.niveles_riesgo?.nombre;
    const nivelRiesgo: NivelRiesgo = riesgo === 'CRITICO' || riesgo === 'ALTO' ? 'ALTO' : riesgo === 'MODERADO' ? 'MODERADO' : 'BAJO';
    return {
      idAlerta: fila.id_alerta,
      categoria: etiquetaCategoria(categoria),
      icono: iconoCategoria(categoria),
      descripcion: fila.descripcion ?? fila.titulo,
      direccion: textoUbicacion(fila.ubicaciones),
      nivelRiesgo,
      estado: (fila.estados_alerta?.nombre ?? 'ACTIVA') as EstadoAlerta,
      fechaPublicacion: fila.fecha_publicacion,
      recomendaciones: this.separarRecomendaciones(fila.recomendaciones),
    };
  }

  private separarRecomendaciones(texto: string | null): string[] {
    if (!texto) return [];
    const partes = texto.includes('\n') ? texto.split('\n') : texto.split(/(?<=[.!?])\s+/);
    return partes.map((parte) => parte.trim()).filter((parte) => parte.length > 0);
  }
}
