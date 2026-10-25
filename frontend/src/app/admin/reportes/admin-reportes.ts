import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminDataService } from '../admin-data.service';
import { AdminIcon } from '../shared/admin-icon';
import { AdminRiskBadge, AdminStatusBadge } from '../shared/admin-badges';
import { AdminTopbar } from '../shared/admin-topbar';

@Component({
  selector: 'app-admin-reportes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, AdminIcon, AdminTopbar, AdminRiskBadge, AdminStatusBadge],
  host: { class: 'adm-page' },
  templateUrl: './admin-reportes.html',
})
export class AdminReportes {
  readonly reportes = toSignal(inject(AdminDataService).listarReportes(), { initialValue: [] });

  readonly busqueda = signal('');
  readonly filtroTipo = signal('');
  readonly filtroEstado = signal('');
  readonly filtroGravedad = signal('');

  readonly pendientes = computed(() => this.reportes().filter((r) => r.estado === 'revision').length);
  readonly filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    return this.reportes().filter((r) => {
      if (this.filtroTipo() && r.tipo !== this.filtroTipo()) return false;
      if (this.filtroEstado() && r.estado !== this.filtroEstado()) return false;
      if (this.filtroGravedad() && r.gravedad !== this.filtroGravedad()) return false;
      if (texto && !r.id.toLowerCase().includes(texto) && !r.ubicacion.toLowerCase().includes(texto)) return false;
      return true;
    });
  });

  limpiar(): void {
    this.busqueda.set('');
    this.filtroTipo.set('');
    this.filtroEstado.set('');
    this.filtroGravedad.set('');
  }
}
