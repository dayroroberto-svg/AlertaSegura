import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AdminDataService } from '../admin-data.service';
import { Alerta } from '../admin.models';
import { AdminIcon } from '../shared/admin-icon';

@Component({
  selector: 'app-admin-alerta-confirmacion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AdminIcon],
  host: { class: 'adm-page', style: 'display: flex; align-items: center; justify-content: center; min-height: 100vh' },
  templateUrl: './admin-alerta-confirmacion.html',
})
export class AdminAlertaConfirmacion {
  private readonly router = inject(Router);

  readonly alerta = signal<Alerta | null>(null);

  constructor() {
    const datos = inject(AdminDataService);
    inject(ActivatedRoute)
      .paramMap.pipe(
        map((params) => params.get('id') ?? ''),
        switchMap((id) => datos.obtenerAlerta(id)),
        takeUntilDestroyed(),
      )
      .subscribe((alerta) => {
        if (alerta) {
          this.alerta.set(alerta);
        } else {
          void this.router.navigateByUrl('/admin/alertas');
        }
      });
  }

  publicacion(alerta: Alerta): string {
    return alerta.hora ? `${alerta.fecha} ${alerta.hora}` : alerta.fecha;
  }
}
