import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';

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

interface ApiResponse<T> {
  data: T;
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
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);

  dashboardMetrics = [
    { label: 'Alertas cercanas', value: '0', detail: 'Alertas publicadas', icon: '⌖', tone: 'blue' },
    { label: 'Mis reportes', value: '0', detail: 'Reportes enviados', icon: '+', tone: 'coral' },
    { label: 'Reportes verificados', value: '0', detail: 'Aprobados por el equipo', icon: '✓', tone: 'green' },
    { label: 'Notificaciones', value: '0', detail: 'Sin leer', icon: '◌', tone: 'amber' },
  ];

  recentAlerts: RecentAlert[] = [];

  reports: CitizenReport[] = [];

  notifications: NotificationItem[] = [];

  ngOnInit(): void {
    forkJoin({
      alerts: this.http.get<ApiResponse<AlertData[]>>(`${environment.apiUrl}/alertas`).pipe(catchError(() => of({ data: [] }))),
      reports: this.http.get<ApiResponse<ReportData[]>>(`${environment.apiUrl}/reportes/mis-reportes`).pipe(catchError(() => of({ data: [] }))),
      notifications: this.http.get<ApiResponse<NotificationData[]>>(`${environment.apiUrl}/notificaciones`).pipe(catchError(() => of({ data: [] }))),
    }).subscribe(({ alerts, reports, notifications }) => {
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
        status: report.estadoReporte,
        tone: report.estadoReporte === 'VERIFICADO' ? 'verified' : 'review',
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
