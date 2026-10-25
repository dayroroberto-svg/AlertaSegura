import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import * as L from 'leaflet';
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
  readonly urlEvidencia = signal<string | null>(null);
  readonly cargandoEvidencia = signal(false);
  readonly analizando = signal(false);
  readonly errorAnalisis = signal(false);

  readonly estiloIa: Record<string, { etiqueta: string; color: string; fondo: string }> = {
    COINCIDE: { etiqueta: 'La foto coincide con el tipo de emergencia', color: '#15803d', fondo: '#f0fdf4' },
    DUDOSA: { etiqueta: 'Foto dudosa, conviene revisarla', color: '#b45309', fondo: '#fffbeb' },
    NO_COINCIDE: { etiqueta: 'Posible broma o foto que no corresponde', color: '#b91c1c', fondo: '#fef2f2' },
    ERROR: { etiqueta: 'La IA no pudo revisar la foto', color: '#475569', fondo: '#f1f5f9' },
  };

  private readonly contenedorMapa = viewChild<ElementRef<HTMLDivElement>>('mapa');
  private mapa?: L.Map;

  constructor() {
    // El mapa se crea cuando el reporte tiene coordenadas y su contenedor ya está en pantalla
    effect(() => {
      const elemento = this.contenedorMapa();
      const reporte = this.reporte();
      if (!elemento || !reporte || reporte.latitud === null || reporte.longitud === null) {
        return;
      }
      this.mapa?.remove();
      this.mapa = L.map(elemento.nativeElement).setView([reporte.latitud, reporte.longitud], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(this.mapa);
      L.marker([reporte.latitud, reporte.longitud], {
        icon: L.divIcon({
          className: '',
          html: '<span style="display:block;width:22px;height:22px;border-radius:50%;background:#dc2626;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.4)"></span>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      }).addTo(this.mapa);
    });
    inject(DestroyRef).onDestroy(() => this.mapa?.remove());

    inject(ActivatedRoute)
      .paramMap.pipe(
        map((params) => params.get('id') ?? ''),
        switchMap((id) => this.datos.obtenerReporte(id)),
        takeUntilDestroyed(),
      )
      .subscribe((reporte) => {
        if (reporte) {
          this.reporte.set(reporte);
          this.cargarEvidencia(reporte);
        } else {
          void this.router.navigateByUrl('/admin/reportes');
        }
      });
  }

  analizarConIa(): void {
    const reporte = this.reporte();
    if (!reporte) return;
    this.analizando.set(true);
    this.errorAnalisis.set(false);
    this.datos.analizarEvidencia(reporte.id).subscribe({
      next: (actualizado) => {
        if (actualizado) this.reporte.set(actualizado);
        this.analizando.set(false);
      },
      error: () => {
        this.errorAnalisis.set(true);
        this.analizando.set(false);
      },
    });
  }

  private cargarEvidencia(reporte: Reporte): void {
    this.urlEvidencia.set(null);
    if (!reporte.evidencia) {
      return;
    }
    this.cargandoEvidencia.set(true);
    this.datos.urlEvidencia(reporte.evidencia).subscribe((url) => {
      this.urlEvidencia.set(url);
      this.cargandoEvidencia.set(false);
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
