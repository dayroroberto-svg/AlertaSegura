import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alerta, ETIQUETA_ESTADO, ETIQUETA_RIESGO } from '../alerta.model';

@Component({
  selector: 'app-alerta-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './alerta-card.html',
  styleUrl: './alerta-card.css',
})
export class AlertaCard {
  readonly alerta = input.required<Alerta>();
  readonly etiquetaRiesgo = ETIQUETA_RIESGO;
  readonly etiquetaEstado = ETIQUETA_ESTADO;
}
