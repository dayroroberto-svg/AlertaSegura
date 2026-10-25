import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { DatosService } from '../../core/data/datos.service';

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

interface AlertData {
  titulo: string;
  categoria: string;
  distrito: string;
  nivelRiesgo: string;
  fechaPublicacion: string;
}

interface ReportData {
  codigoReporte: string;
  titulo: string;
  estadoReporte: string;
}

interface NotificationData {
  titulo: string;
  mensaje: string;
  fechaEnvio: string;
  leida: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly auth = inject(AuthService);
  private readonly datos = inject(DatosService);

  dashboardMetrics = [
    { label: 'Alertas cercanas', value: '0', detail: 'Alertas publicadas', icon: '🔔', tone: 'coral' },
    { label: 'Mis reportes', value: '0', detail: 'Reportes enviados', icon: '📋', tone: 'blue' },
    { label: 'Reportes verificados', value: '0', detail: 'Aprobados por el equipo', icon: '✅', tone: 'green' },
    { label: 'Notificaciones', value: '0', detail: 'Sin leer', icon: '📣', tone: 'amber' },
  ];

  recentAlerts: RecentAlert[] = [];

  reports: CitizenReport[] = [];

  notifications: NotificationItem[] = [];

  ngOnInit(): void {
    Promise.all([
      this.datos.alertas().catch(() => []),
      this.datos.misReportes().catch(() => []),
      this.datos.misNotificaciones().catch(() => []),
    ]).then(([alertas, misReportes, misNotificaciones]) => {
      const alerts: { data: AlertData[] } = {
        data: alertas.map((alerta) => ({
          titulo: alerta.titulo,
          categoria: alerta.categorias_emergencia?.nombre ?? '',
          distrito: alerta.ubicaciones?.distrito ?? '',
          nivelRiesgo: alerta.niveles_riesgo?.nombre ?? '',
          fechaPublicacion: alerta.fecha_publicacion,
        })),
      };
      const reports: { data: ReportData[] } = {
        data: misReportes.map((reporte) => ({
          codigoReporte: reporte.codigo_reporte,
          titulo: reporte.titulo,
          estadoReporte: reporte.estados_reporte?.nombre ?? '',
        })),
      };
      const notifications: { data: NotificationData[] } = {
        data: misNotificaciones.map((notificacion) => ({
          titulo: notificacion.titulo,
          mensaje: notificacion.mensaje ?? '',
          fechaEnvio: notificacion.fecha_envio,
          leida: notificacion.leida,
        })),
      };
      this.recentAlerts = (alerts.data ?? []).slice(0, 3).map((alert) => ({
        type: alert.categoria,
        title: alert.titulo,
        location: alert.distrito || 'Ubicación no disponible',
        time: this.formatDate(alert.fechaPublicacion),
        risk: this.riskLabel(alert.nivelRiesgo),
        tone: this.riskTone(alert.nivelRiesgo),
      }));
      this.reports = (reports.data ?? []).slice(0, 3).map((report) => ({
        code: report.codigoReporte,
        title: report.titulo,
        status: this.reportStatusLabel(report.estadoReporte),
        tone: report.estadoReporte === 'VERIFICADO' ? 'verified' : report.estadoReporte === 'RECHAZADO' ? 'rejected' : 'review',
      }));
      this.notifications = (notifications.data ?? []).slice(0, 3).map((notification) => ({
        title: notification.titulo,
        message: notification.mensaje,
        time: this.formatDate(notification.fechaEnvio),
        tone: notification.leida ? 'blue' : 'coral',
      }));
      this.dashboardMetrics = [
        { ...this.dashboardMetrics[0], value: String(alerts.data?.length ?? 0) },
        { ...this.dashboardMetrics[1], value: String(reports.data?.length ?? 0) },
        { ...this.dashboardMetrics[2], value: String(reports.data?.filter((report) => report.estadoReporte === 'VERIFICADO').length ?? 0) },
        { ...this.dashboardMetrics[3], value: String(notifications.data?.filter((notification) => !notification.leida).length ?? 0) },
      ];
    });
  }

  icono(categoria: string): string {
    const nombre = categoria.toUpperCase();
    const iconos: Record<string, string> = {
      SISMO: '🌎', INCENDIO: '🔥', INUNDACION: '🌊', DESLIZAMIENTO: '⛰️', ACCIDENTE_TRANSITO: '🚗',
    };
    return iconos[nombre] ?? '⚠️';
  }

  private reportStatusLabel(status: string): string {
    return { EN_REVISION: 'En revisión', PENDIENTE: 'En revisión', VERIFICADO: 'Verificado', RECHAZADO: 'Rechazado' }[status] ?? status;
  }

  private riskLabel(risk: string): string {
    return { CRITICO: 'Alto', ALTO: 'Alto', MODERADO: 'Moderado', BAJO: 'Bajo' }[risk] ?? risk;
  }

  private riskTone(risk: string): string {
    return risk === 'CRITICO' || risk === 'ALTO' ? 'coral' : risk === 'MODERADO' ? 'sand' : 'blue';
  }

  private formatDate(value: string): string {
    if (!value) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }
}
