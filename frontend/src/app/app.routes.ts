import { Routes } from '@angular/router';
import { authGuard } from './client/core/auth/auth.guard';
import { Home } from './client/home/home';
import { CLIENT_ROUTES } from './client/client.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'inicio', component: Home },
  { path: 'login', loadComponent: () => import('./client/auth/login/login').then((module) => module.Login) },
  { path: 'registro', loadComponent: () => import('./client/auth/register/register').then((module) => module.Register) },
  { path: 'dashboard', loadComponent: () => import('./client/dashboard/dashboard').then((module) => module.Dashboard), canActivate: [authGuard] },
  { path: 'mapa', loadComponent: () => import('./client/map/map').then((module) => module.Map) },
  { path: 'reportar', loadComponent: () => import('./client/report/reportar').then((module) => module.Reportar) },
  { path: 'prevencion', loadComponent: () => import('./client/prevention/prevention').then((module) => module.Prevention) },
  { path: 'contactos', loadComponent: () => import('./client/contacts/contacts').then((module) => module.Contacts) },
  ...CLIENT_ROUTES,
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then((module) => module.ADMIN_ROUTES) },
  { path: '**', redirectTo: '' },
];
