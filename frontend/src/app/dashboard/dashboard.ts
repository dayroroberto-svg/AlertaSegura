import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';

interface RecentAlert {
  type: string;
  title: string;
  location: string;
  time: string;
  risk: string;
  tone: string;
}

interface CitizenReport {
  code: string;
  title: string;
  status: string;
  tone: string;
}

interface NotificationItem {
  title: string;
  message: string;
  time: string;
  tone: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly auth = inject(AuthService);

  readonly dashboardMetrics = [
    { label: 'Alertas cercanas', value: '03', detail: 'En tu zona', icon: '⌖', tone: 'blue' },
    { label: 'Mis reportes', value: '02', detail: 'Reportes enviados', icon: '+', tone: 'coral' },
    { label: 'Reportes verificados', value: '01', detail: 'Aprobados por el equipo', icon: '✓', tone: 'green' },
    { label: 'Notificaciones', value: '04', detail: 'Sin leer', icon: '◌', tone: 'amber' },
  ];

  readonly recentAlerts: RecentAlert[] = [
    { type: 'Incendio', title: 'Incidente reportado en Ate', location: 'Av. Nicolas Ayllon, Ate', time: 'Hace 18 min', risk: 'Alto', tone: 'coral' },
    { type: 'Sismo', title: 'Movimiento registrado', location: 'Lima Este, Peru', time: 'Hace 42 min', risk: 'Moderado', tone: 'sand' },
    { type: 'Inundacion', title: 'Acumulacion de agua', location: 'Santa Anita, Lima', time: 'Hace 1 h', risk: 'Bajo', tone: 'blue' },
  ];

  readonly reports: CitizenReport[] = [
    { code: 'REP-2026-001', title: 'Incidente reportado en Ate', status: 'En revisión', tone: 'review' },
    { code: 'REP-2026-002', title: 'Acumulación de agua', status: 'Verificado', tone: 'verified' },
  ];

  readonly notifications: NotificationItem[] = [
    { title: 'Alerta cercana', message: 'Se registró un incendio en Ate.', time: 'Hace 18 min', tone: 'coral' },
    { title: 'Reporte actualizado', message: 'Tu reporte REP-2026-002 fue verificado.', time: 'Hace 1 h', tone: 'green' },
    { title: 'Recomendación', message: 'Revisa las medidas preventivas ante sismos.', time: 'Ayer', tone: 'blue' },
  ];
}
