import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../admin-data.service';
import { UsuarioAdmin } from '../admin.models';
import { AdminIcon } from '../shared/admin-icon';
import { AdminTopbar } from '../shared/admin-topbar';

@Component({
  selector: 'app-admin-usuarios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AdminIcon, AdminTopbar],
  host: { class: 'adm-page' },
  templateUrl: './admin-usuarios.html',
})
export class AdminUsuarios {
  private readonly datos = inject(AdminDataService);

  readonly usuarios = signal<UsuarioAdmin[]>([]);
  readonly busqueda = signal('');
  readonly filtroEstado = signal('');
  readonly seleccionado = signal<UsuarioAdmin | null>(null);

  readonly activos = computed(() => this.usuarios().filter((u) => u.activo).length);
  readonly filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const estado = this.filtroEstado();
    return this.usuarios().filter((u) => {
      if (estado === 'activos' && !u.activo) return false;
      if (estado === 'inactivos' && u.activo) return false;
      return !texto || u.nombre.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto);
    });
  });

  constructor() {
    this.recargar();
  }

  alternar(usuario: UsuarioAdmin): void {
    this.datos.cambiarEstadoUsuario(usuario.id, !usuario.activo).subscribe(() => this.recargar());
  }

  private recargar(): void {
    this.datos.listarUsuarios().subscribe((usuarios) => this.usuarios.set(usuarios));
  }
}
