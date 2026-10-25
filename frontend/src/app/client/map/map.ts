import { AfterViewInit, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import * as L from 'leaflet';
import { DatosService } from '../../core/data/datos.service';
import { etiquetaCategoria } from '../../core/data/etiquetas';

interface EmergencyAlert {
  idAlerta: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  nivelRiesgo: string;
  colorRiesgo: string;
  estadoAlerta: string;
  distrito: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements OnInit, AfterViewInit, OnDestroy {
  private readonly disasterTypes = [
    'INCENDIO',
    'SISMO',
    'INUNDACION',
    'ACCIDENTE_TRANSITO',
    'DESLIZAMIENTO',
    'ROBO',
    'EMERGENCIA_MEDICA',
    'COLAPSO_ESTRUCTURAL',
    'FUGA_GAS',
    'OTROS',
  ];
  private readonly datos = inject(DatosService);
  private leafletMap?: L.Map;
  private markerLayer?: L.LayerGroup;
  private userMarker?: L.CircleMarker;

  readonly alerts = signal<EmergencyAlert[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly locationError = signal(false);
  readonly selectedRisk = signal('TODOS');
  readonly selectedCategory = signal('TODOS');
  readonly selected = signal<EmergencyAlert | null>(null);

  readonly pills = [
    { valor: 'TODOS', etiqueta: 'Todos' },
    { valor: 'SISMO', etiqueta: 'Sismo' },
    { valor: 'INCENDIO', etiqueta: 'Incendio' },
    { valor: 'INUNDACION', etiqueta: 'Inundación' },
    { valor: 'DESLIZAMIENTO', etiqueta: 'Deslizamiento' },
    { valor: 'ACCIDENTE_TRANSITO', etiqueta: 'Accidente' },
  ];

  private readonly iconos: Record<string, string> = {
    SISMO: '🌎', INCENDIO: '🔥', INUNDACION: '🌊', DESLIZAMIENTO: '⛰️', ACCIDENTE_TRANSITO: '🚗',
    ROBO: '⚠️', EMERGENCIA_MEDICA: '🚑', COLAPSO_ESTRUCTURAL: '🏚️', FUGA_GAS: '💨',
  };

  ngOnInit(): void {
    this.datos.alertas().then(
      (filas) => {
        this.alerts.set(
          filas.map((fila) => ({
            idAlerta: fila.id_alerta,
            titulo: fila.titulo,
            descripcion: fila.descripcion ?? '',
            categoria: fila.categorias_emergencia?.nombre ?? '',
            nivelRiesgo: fila.niveles_riesgo?.nombre ?? '',
            colorRiesgo: fila.niveles_riesgo?.color ?? '',
            estadoAlerta: fila.estados_alerta?.nombre ?? '',
            distrito: fila.ubicaciones?.distrito ?? '',
            direccion: fila.ubicaciones?.direccion ?? '',
            latitud: fila.ubicaciones?.latitud ?? null,
            longitud: fila.ubicaciones?.longitud ?? null,
          })),
        );
        this.loading.set(false);
        this.renderMarkers();
      },
      () => {
        this.loading.set(false);
        this.error.set(true);
      },
    );
  }

  ngAfterViewInit(): void {
    this.leafletMap = L.map('emergency-map', { zoomControl: false }).setView([-12.0464, -77.0428], 11);
    L.control.zoom({ position: 'bottomleft' }).addTo(this.leafletMap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.leafletMap);
    this.markerLayer = L.layerGroup().addTo(this.leafletMap);
    this.renderMarkers();
  }

  ngOnDestroy(): void {
    this.leafletMap?.remove();
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
    const seleccionada = this.selected();
    if (seleccionada && !this.filteredAlerts().some((alert) => alert.idAlerta === seleccionada.idAlerta)) {
      this.selected.set(null);
    }
    this.renderMarkers();
  }

  toggleSelected(alert: EmergencyAlert): void {
    const nueva = this.selected()?.idAlerta === alert.idAlerta ? null : alert;
    this.selected.set(nueva);
    if (nueva && nueva.latitud !== null && nueva.longitud !== null) {
      this.leafletMap?.setView([nueva.latitud, nueva.longitud], Math.max(this.leafletMap.getZoom(), 13));
    }
    this.renderMarkers();
  }

  icono(categoria: string): string {
    return this.iconos[categoria] ?? '⚠️';
  }

  riskClass(risk: string): string {
    return this.normalizedRisk(risk).toLowerCase();
  }

  categories(): string[] {
    const publicadas = Array.from(new Set(this.alerts().map((alert) => alert.categoria))).filter(
      (categoria) => categoria && !this.disasterTypes.includes(categoria),
    );
    return ['TODOS', ...this.disasterTypes, ...publicadas];
  }

  etiqueta(categoria: string): string {
    return etiquetaCategoria(categoria);
  }

  categoryLabel(category: string): string {
    return {
      TODOS: 'Todos los tipos',
      INCENDIO: 'Incendios',
      SISMO: 'Sismos',
      INUNDACION: 'Inundaciones',
      ACCIDENTE_TRANSITO: 'Accidentes de tránsito',
      DESLIZAMIENTO: 'Deslizamientos',
      ROBO: 'Robos',
      EMERGENCIA_MEDICA: 'Emergencias médicas',
      COLAPSO_ESTRUCTURAL: 'Colapsos estructurales',
      FUGA_GAS: 'Fugas de gas',
      OTROS: 'Otros',
    }[category] ?? category;
  }

  filteredAlerts(): EmergencyAlert[] {
    const risk = this.selectedRisk();
    const category = this.selectedCategory();

    return this.alerts().filter(
      (alert) =>
        (risk === 'TODOS' || this.normalizedRisk(alert.nivelRiesgo) === risk) &&
        (category === 'TODOS' || alert.categoria === category),
    );
  }

  normalizedRisk(risk: string): string {
    if (risk === 'CRITICO') {
      return 'ALTO';
    }

    if (risk === 'MODERADO') {
      return 'MEDIO';
    }

    return risk;
  }

  riskLabel(risk: string): string {
    return { ALTO: 'Alto riesgo', MEDIO: 'Riesgo medio', BAJO: 'Riesgo bajo' }[this.normalizedRisk(risk)] ?? risk;
  }

  statusLabel(status: string): string {
    return { ACTIVA: 'Activa', EN_SEGUIMIENTO: 'En seguimiento', CONTROLADA: 'Controlada' }[status] ?? status;
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }

  locateUser(): void {
    if (!navigator.geolocation || !this.leafletMap) {
      this.locationError.set(true);
      return;
    }

    this.locationError.set(false);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.leafletMap?.setView([coords.latitude, coords.longitude], 14);
        this.userMarker?.remove();
        this.userMarker = L.circleMarker([coords.latitude, coords.longitude], {
          radius: 8,
          color: '#ffffff',
          weight: 3,
          fillColor: '#2563eb',
          fillOpacity: 1,
        })
          .addTo(this.leafletMap!)
          .bindTooltip('Tu ubicación', { permanent: false });
      },
      () => this.locationError.set(true),
    );
  }

  private renderMarkers(): void {
    if (!this.markerLayer) {
      return;
    }

    this.markerLayer.clearLayers();
    this.filteredAlerts()
      .filter((alert) => alert.latitud !== null && alert.longitud !== null)
      .forEach((alert) => {
        const activa = this.selected()?.idAlerta === alert.idAlerta;
        const marker = L.marker([alert.latitud!, alert.longitud!], {
          icon: L.divIcon({
            className: 'alert-marker-wrapper',
            html: `<span class="alert-marker ${this.riskClass(alert.nivelRiesgo)}${activa ? ' activa' : ''}">${this.icono(alert.categoria)}</span>`,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
          }),
        });
        marker.on('click', () => this.toggleSelected(alert));
        marker.addTo(this.markerLayer!);
      });
  }
}
