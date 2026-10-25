import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
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

  readonly filtroNivel = signal('');
  readonly seleccionado = signal<PinMapa | null>(null);
  readonly filtrados = computed(() => this.pines().filter((p) => !this.filtroNivel() || p.nivel === this.filtroNivel()));

  private readonly contenedor = viewChild<ElementRef<HTMLDivElement>>('mapa');
  private mapa?: L.Map;
  private capa?: L.LayerGroup;

  constructor() {
    effect(() => {
      const elemento = this.contenedor();
      if (elemento && !this.mapa) {
        this.iniciarMapa(elemento.nativeElement);
      }
      this.dibujar(this.filtrados(), this.seleccionado());
    });
    inject(DestroyRef).onDestroy(() => this.mapa?.remove());
  }

  color(nivel: NivelRiesgo): string {
    return COLOR_NIVEL[nivel];
  }

  alternar(pin: PinMapa): void {
    const nuevo = this.seleccionado()?.id === pin.id ? null : pin;
    this.seleccionado.set(nuevo);
    if (nuevo) {
      this.mapa?.setView([nuevo.latitud, nuevo.longitud], Math.max(this.mapa.getZoom(), 14));
    }
  }

  private iniciarMapa(contenedor: HTMLDivElement): void {
    this.mapa = L.map(contenedor).setView([-12.0464, -77.0428], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.mapa);
    this.capa = L.layerGroup().addTo(this.mapa);
  }

  private dibujar(pines: PinMapa[], seleccionado: PinMapa | null): void {
    if (!this.mapa || !this.capa) {
      return;
    }
    this.capa.clearLayers();
    pines.forEach((pin) => {
      const activo = seleccionado?.id === pin.id;
      const tamano = activo ? 32 : 22;
      const marcador = L.marker([pin.latitud, pin.longitud], {
        title: pin.tipo,
        icon: L.divIcon({
          className: '',
          html: `<span style="display:block;width:${tamano}px;height:${tamano}px;border-radius:50%;background:${this.color(pin.nivel)};border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.4)"></span>`,
          iconSize: [tamano, tamano],
          iconAnchor: [tamano / 2, tamano / 2],
        }),
      });
      marcador.on('click', () => this.alternar(pin));
      marcador.addTo(this.capa!);
    });
  }
}
