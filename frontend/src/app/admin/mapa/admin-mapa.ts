import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../admin-data.service';
import { NivelRiesgo, PinMapa } from '../admin.models';
import { AdminIcon } from '../shared/admin-icon';
import { AdminRiskBadge } from '../shared/admin-badges';
import { AdminTopbar } from '../shared/admin-topbar';

const COLOR_NIVEL: Record<NivelRiesgo, string> = { alto: '#dc2626', medio: '#ea580c', bajo: '#ca8a04' };

@Component({
  selector: 'app-admin-mapa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AdminIcon, AdminTopbar, AdminRiskBadge],
  host: { class: 'adm-page' },
  templateUrl: './admin-mapa.html',
})
export class AdminMapa {
  readonly pines = toSignal(inject(AdminDataService).listarPinesMapa(), { initialValue: [] });

  readonly leyenda = [
    { nivel: 'alto' as NivelRiesgo, etiqueta: 'Alto' },
    { nivel: 'medio' as NivelRiesgo, etiqueta: 'Medio' },
    { nivel: 'bajo' as NivelRiesgo, etiqueta: 'Bajo' },
  ];
  readonly lineasVerticales = Array.from({ length: 8 }, (_, i) => (i + 1) * 12.5);
  readonly lineasHorizontales = Array.from({ length: 6 }, (_, i) => (i + 1) * 16.7);

  readonly filtroNivel = signal('');
  readonly seleccionado = signal<PinMapa | null>(null);
  readonly filtrados = computed(() => this.pines().filter((p) => !this.filtroNivel() || p.nivel === this.filtroNivel()));

  color(nivel: NivelRiesgo): string {
    return COLOR_NIVEL[nivel];
  }

  alternar(pin: PinMapa): void {
    this.seleccionado.set(this.seleccionado()?.id === pin.id ? null : pin);
  }
}
