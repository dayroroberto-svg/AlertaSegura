import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AdminDataService } from '../admin-data.service';
import { Reporte } from '../admin.models';
import { AdminIcon } from '../shared/admin-icon';
import { AdminRiskBadge, AdminStatusBadge } from '../shared/admin-badges';
import { AdminTopbar } from '../shared/admin-topbar';

@Component({
  selector: 'app-admin-reporte-detalle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AdminIcon, AdminTopbar, AdminRiskBadge, AdminStatusBadge],
  host: { class: 'adm-page' },
  templateUrl: './admin-reporte-detalle.html',
})
export class AdminReporteDetalle {
  private readonly datos = inject(AdminDataService);
  private readonly router = inject(Router);

  readonly reporte = signal<Reporte | null>(null);
  readonly modal = signal<'verificar' | 'rechazar' | null>(null);

  constructor() {
    inject(ActivatedRoute)
      .paramMap.pipe(
        map((params) => params.get('id') ?? ''),
        switchMap((id) => this.datos.obtenerReporte(id)),
        takeUntilDestroyed(),
      )
      .subscribe((reporte) => {
        if (reporte) {
          this.reporte.set(reporte);
        } else {
          void this.router.navigateByUrl('/admin/reportes');
        }
      });
  }

  confirmar(accion: 'verificar' | 'rechazar'): void {
    const reporte = this.reporte();
    this.modal.set(null);
    if (!reporte) return;

    if (accion === 'verificar') {
      this.datos.verificarReporte(reporte.id).subscribe(() => {
        void this.router.navigate(['/admin/alertas/nueva'], { queryParams: { reporte: reporte.id } });
      });
    } else {
      this.datos.rechazarReporte(reporte.id).subscribe((actualizado) => this.reporte.set(actualizado));
    }
  }
}
