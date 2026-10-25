import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminDataService } from '../admin-data.service';
import { AdminIcon } from '../shared/admin-icon';
import { AdminTopbar } from '../shared/admin-topbar';

type Seccion = 'perfil' | 'notificaciones' | 'categorias' | 'sistema';

@Component({
  selector: 'app-admin-configuracion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminIcon, AdminTopbar],
  host: { class: 'adm-page' },
  templateUrl: './admin-configuracion.html',
})
export class AdminConfiguracion {
  private readonly datos = inject(AdminDataService);
  readonly configuracion = toSignal(this.datos.obtenerConfiguracion());

  readonly secciones: { key: Seccion; label: string; icon: string }[] = [
    { key: 'perfil', label: 'Perfil del administrador', icon: 'user' },
    { key: 'notificaciones', label: 'Notificaciones', icon: 'bell' },
    { key: 'categorias', label: 'Categorías de emergencia', icon: 'alerts' },
    { key: 'sistema', label: 'Configuración general', icon: 'settings' },
  ];

  readonly seccion = signal<Seccion>('perfil');
  readonly notificaciones = signal<boolean[]>([]);

  constructor() {
    effect(() => {
      const config = this.configuracion();
      if (config) {
        this.notificaciones.set(config.notificaciones.map((n) => n.on));
      }
    });
  }

  alternar(indice: number): void {
    this.notificaciones.update((estados) => estados.map((on, i) => (i === indice ? !on : on)));
    this.datos.guardarNotificaciones(this.notificaciones()).subscribe();
  }

  camposPerfil(): [string, string][] {
    const p = this.configuracion()?.perfil;
    return p
      ? [
          ['Nombre completo', p.nombre],
          ['Cargo', p.cargo],
          ['Teléfono', p.telefono],
          ['Organización', p.organizacion],
        ]
      : [];
  }
}
