import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AlertaCard } from '../alertas/alerta-card/alerta-card';
import { AlertasService } from '../alertas/alertas.service';
import { Alerta } from '../alertas/alerta.model';

interface TipoEmergencia {
  nombre: string;
  categoria: string;
  icono: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, AlertaCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly alertasService = inject(AlertasService);

  private readonly alertas = toSignal(this.alertasService.listar(), { initialValue: [] as Alerta[] });

  readonly recientes = computed(() => this.alertas().slice(0, 3));
  readonly activas = computed(() => this.alertas().filter((alerta) => alerta.estado === 'ACTIVA').length);

  readonly tipos: TipoEmergencia[] = [
    { nombre: 'Sismos', categoria: 'Sismo', icono: '🌍' },
    { nombre: 'Incendios', categoria: 'Incendio', icono: '🔥' },
    { nombre: 'Inundaciones', categoria: 'Inundación', icono: '🌊' },
    { nombre: 'Deslizamientos', categoria: 'Deslizamiento', icono: '⛰️' },
  ];

  // Cifras de presentación del prototipo; no vienen de la base de datos.
  readonly cifras = [
    { icono: '🔴', valor: '47', etiqueta: 'Alertas activas', tono: 'rojo' },
    { icono: '📋', valor: '1,284', etiqueta: 'Reportes recibidos', tono: 'azul' },
    { icono: '✅', valor: '362', etiqueta: 'Emergencias verificadas', tono: 'verde' },
    { icono: '📍', valor: '18', etiqueta: 'Regiones monitoreadas', tono: 'ambar' },
  ];

  readonly pasos = [
    { numero: '01', icono: '📡', titulo: 'Reporta', texto: 'Ciudadanos reportan incidentes con ubicación, descripción e imágenes en tiempo real desde cualquier dispositivo.' },
    { numero: '02', icono: '🔍', titulo: 'Verificamos', texto: 'Equipos especializados del INDECI y entidades competentes revisan cada reporte antes de publicarlo.' },
    { numero: '03', icono: '📢', titulo: 'Informamos', texto: 'La alerta llega de inmediato a todos los ciudadanos de la zona afectada con recomendaciones claras.' },
  ];

  contar(categoria: string): number {
    return this.alertas().filter((alerta) => alerta.categoria === categoria && alerta.estado !== 'CONTROLADA').length;
  }
}
