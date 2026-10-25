import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AdminDataService } from '../admin-data.service';
import { AdminIcon } from '../shared/admin-icon';
import { AdminTopbar } from '../shared/admin-topbar';

@Component({
  selector: 'app-admin-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AdminIcon, AdminTopbar],
  host: { class: 'adm-page' },
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  readonly resumen = toSignal(inject(AdminDataService).obtenerResumenDashboard());

  readonly accionesRapidas = [
    { label: 'Ver reportes pendientes', icon: 'reports', ruta: '/admin/reportes', color: '#eff6ff', iconColor: '#2563eb' },
    { label: 'Gestionar alertas', icon: 'alerts', ruta: '/admin/alertas', color: '#fef2f2', iconColor: '#dc2626' },
    { label: 'Ver mapa de emergencias', icon: 'map', ruta: '/admin/mapa', color: '#f0fdf4', iconColor: '#16a34a' },
    { label: 'Gestionar usuarios', icon: 'users', ruta: '/admin/usuarios', color: '#f5f3ff', iconColor: '#7c3aed' },
  ];

  colorActividad(tipo: string): string {
    return tipo === 'alto' ? '#dc2626' : tipo === 'medio' ? '#ea580c' : '#94a3b8';
  }
}
