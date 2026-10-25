import { Routes } from '@angular/router';

// Rutas de las pantallas ciudadanas nuevas. `app.routes.ts` las monta en la raíz.
export const CLIENT_ROUTES: Routes = [
  { path: 'alertas', loadComponent: () => import('./alertas/alertas-lista/alertas-lista').then((m) => m.AlertasLista) },
  { path: 'alertas/:id', loadComponent: () => import('./alertas/alerta-detalle/alerta-detalle').then((m) => m.AlertaDetalle) },
  { path: 'reporte-enviado', loadComponent: () => import('./reporte-enviado/reporte-enviado').then((m) => m.ReporteEnviadoPage) },
  { path: 'ayuda', data: { pagina: 'ayuda' }, loadComponent: () => import('./info/info').then((m) => m.Info) },
  { path: 'terminos', data: { pagina: 'terminos' }, loadComponent: () => import('./info/info').then((m) => m.Info) },
  { path: 'privacidad', data: { pagina: 'privacidad' }, loadComponent: () => import('./info/info').then((m) => m.Info) },
  { path: 'accesibilidad', data: { pagina: 'accesibilidad' }, loadComponent: () => import('./info/info').then((m) => m.Info) },
];
