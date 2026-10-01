import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './home/home';
import { Register } from './auth/register/register';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'inicio', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'mapa', loadComponent: () => import('./map/map').then((module) => module.Map) },
  { path: '**', redirectTo: '' },
];
