import { Routes } from '@angular/router';
import { adminGuard } from './admin.guard';

// Rutas del panel administrador. `app.routes.ts` las monta bajo `/admin`.
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () => import('./layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/admin-dashboard').then((m) => m.AdminDashboard) },
      { path: 'reportes', loadComponent: () => import('./reportes/admin-reportes').then((m) => m.AdminReportes) },
      { path: 'reportes/:id', loadComponent: () => import('./reporte-detalle/admin-reporte-detalle').then((m) => m.AdminReporteDetalle) },
      { path: 'alertas', loadComponent: () => import('./alertas/admin-alertas').then((m) => m.AdminAlertas) },
      { path: 'alertas/nueva', loadComponent: () => import('./crear-alerta/admin-crear-alerta').then((m) => m.AdminCrearAlerta) },
      { path: 'alertas/confirmacion/:id', loadComponent: () => import('./alerta-confirmacion/admin-alerta-confirmacion').then((m) => m.AdminAlertaConfirmacion) },
      { path: 'usuarios', loadComponent: () => import('./usuarios/admin-usuarios').then((m) => m.AdminUsuarios) },
      { path: 'mapa', loadComponent: () => import('./mapa/admin-mapa').then((m) => m.AdminMapa) },
      { path: 'configuracion', loadComponent: () => import('./configuracion/admin-configuracion').then((m) => m.AdminConfiguracion) },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
