import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface ReporteEnviado {
  idReporte?: number;
  evidenciaFallida?: boolean;
  fechaEnvio: string;
}

@Component({
  selector: 'app-reporte-enviado',
  imports: [DatePipe, RouterLink],
  templateUrl: './reporte-enviado.html',
  styleUrl: './reporte-enviado.css',
})
export class ReporteEnviadoPage {
  // El estado de navegación lo escribe `reportar` al terminar el envío.
  readonly reporte: ReporteEnviado = inject(Router).getCurrentNavigation()?.extras.state?.['reporte'] ??
    history.state?.reporte ?? { fechaEnvio: new Date().toISOString() };

  readonly numero = this.reporte.idReporte
    ? `RPT-${new Date(this.reporte.fechaEnvio).getFullYear()}-${String(this.reporte.idReporte).padStart(4, '0')}`
    : null;
}
