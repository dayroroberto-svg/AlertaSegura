import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDataService } from '../admin-data.service';
import { Alerta, EstadoAlerta } from '../admin.models';
import { AdminIcon } from '../shared/admin-icon';
import { AdminAlertStatusBadge, AdminRiskBadge } from '../shared/admin-badges';
import { AdminTopbar } from '../shared/admin-topbar';

@Component({
  selector: 'app-admin-alertas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AdminIcon, AdminTopbar, AdminRiskBadge, AdminAlertStatusBadge],
  host: { class: 'adm-page' },
  templateUrl: './admin-alertas.html',
})
export class AdminAlertas {
  private readonly datos = inject(AdminDataService);

  readonly pestanas: { clave: EstadoAlerta; etiqueta: string }[] = [
    { clave: 'activa', etiqueta: 'Alertas activas' },
    { clave: 'finalizada', etiqueta: 'Finalizadas' },
    { clave: 'archivada', etiqueta: 'Archivadas' },
  ];

  readonly alertas = signal<Alerta[]>([]);
  readonly pestana = signal<EstadoAlerta>('activa');
  readonly edicion = signal<Alerta | null>(null);
  readonly filtradas = computed(() => this.alertas().filter((a) => a.estado === this.pestana()));

  constructor() {
    this.recargar();
  }

  cantidad(estado: EstadoAlerta): number {
    return this.alertas().filter((a) => a.estado === estado).length;
  }

  cambiarEstado(alerta: Alerta, estado: EstadoAlerta): void {
    this.datos.cambiarEstadoAlerta(alerta.id, estado).subscribe(() => this.recargar());
  }

  guardar(alerta: Alerta, titulo: string, estado: string): void {
    this.edicion.set(null);
    this.datos.actualizarAlerta(alerta.id, { titulo, estado: estado as EstadoAlerta }).subscribe(() => this.recargar());
  }

  private recargar(): void {
    this.datos.listarAlertas().subscribe((alertas) => this.alertas.set(alertas));
  }
}
