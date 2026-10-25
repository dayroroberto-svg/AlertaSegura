import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AlertasService } from '../alertas.service';
import { ETIQUETA_ESTADO, ETIQUETA_RIESGO } from '../alerta.model';

@Component({
  selector: 'app-alerta-detalle',
  imports: [DatePipe, RouterLink],
  templateUrl: './alerta-detalle.html',
  styleUrl: './alerta-detalle.css',
})
export class AlertaDetalle {
  private readonly alertasService = inject(AlertasService);

  readonly etiquetaRiesgo = ETIQUETA_RIESGO;
  readonly etiquetaEstado = ETIQUETA_ESTADO;

  readonly contactos = [
    { nombre: 'Bomberos', telefono: '116' },
    { nombre: 'INDECI', telefono: '115' },
    { nombre: 'Ambulancia (SAMU)', telefono: '106' },
  ];

  private readonly resultado = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      switchMap((parametros) => this.alertasService.obtener(Number(parametros.get('id')))),
      map((alerta) => ({ cargado: true, alerta })),
    ),
    { initialValue: { cargado: false, alerta: undefined } },
  );

  readonly alerta = computed(() => this.resultado().alerta);
  readonly cargado = computed(() => this.resultado().cargado);
}
