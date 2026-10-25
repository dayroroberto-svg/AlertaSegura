import { Routes } from '@angular/router';

// Rutas de las pantallas ciudadanas nuevas. `app.routes.ts` las monta en la raíz.
export const CLIENT_ROUTES: Routes = [
  { path: 'alertas', loadComponent: () => import('./alertas/alertas-lista/alertas-lista').then((m) => m.AlertasLista) },
  { path: 'alertas/:id', loadComponent: () => import('./alertas/alerta-detalle/alerta-detalle').then((m) => m.AlertaDetalle) },
  { path: 'reporte-enviado', loadComponent: () => import('./reporte-enviado/reporte-enviado').then((m) => m.ReporteEnviadoPage) },
];
