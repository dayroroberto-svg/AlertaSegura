import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../client/core/auth/auth.service';
import { AdminIcon } from '../shared/admin-icon';

const MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', ruta: '/admin/dashboard' },
  { key: 'reportes', label: 'Reportes', icon: 'reports', ruta: '/admin/reportes' },
  { key: 'alertas', label: 'Alertas', icon: 'alerts', ruta: '/admin/alertas' },
  { key: 'usuarios', label: 'Usuarios', icon: 'users', ruta: '/admin/usuarios' },
  { key: 'mapa', label: 'Mapa', icon: 'map', ruta: '/admin/mapa' },
  { key: 'configuracion', label: 'Configuración', icon: 'settings', ruta: '/admin/configuracion' },
] as const;

// Las pantallas de detalle, creación y confirmación cuelgan del menú "Reportes", igual que en el diseño.
const RUTAS_DE_REPORTES = ['/admin/reportes/', '/admin/alertas/nueva', '/admin/alertas/confirmacion'];

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, RouterOutlet, AdminIcon],
  styleUrl: '../admin.css',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly url = signal(this.router.url);

  readonly menu = MENU;
  readonly activo = computed(() => {
    const url = this.url().split('?')[0];
    if (RUTAS_DE_REPORTES.some((ruta) => url.startsWith(ruta))) {
      return 'reportes';
    }
    return MENU.find((item) => url.startsWith(item.ruta))?.key ?? 'dashboard';
  });
  readonly nombre = computed(() => {
    const session = this.auth.session();
    return session ? `${session.nombres} ${session.apellidos}`.trim() : 'Admin General';
  });
  readonly correo = computed(() => this.auth.session()?.correo ?? 'admin@alertasegura.pe');

  cerrarSesion(): void {
    this.auth.logout();
  }

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => this.url.set(event.urlAfterRedirects));
  }
}
