import { AfterViewInit, Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

interface ApiResponse<T> {
  data: T;
}

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
export class Map implements OnInit, AfterViewInit {
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
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/alertas';
  private leafletMap?: L.Map;
  private markerLayer?: L.LayerGroup;

  readonly alerts = signal<EmergencyAlert[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly selectedRisk = signal('TODOS');
  readonly selectedCategory = signal('TODOS');

  ngOnInit(): void {
    this.http.get<ApiResponse<EmergencyAlert[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.alerts.set(response.data ?? []);
        this.loading.set(false);
        this.renderMarkers();
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  ngAfterViewInit(): void {
    this.leafletMap = L.map('emergency-map', { zoomControl: false }).setView([-12.0464, -77.0428], 11);
    L.control.zoom({ position: 'bottomright' }).addTo(this.leafletMap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.leafletMap);
    this.markerLayer = L.layerGroup().addTo(this.leafletMap);
    this.renderMarkers();
  }

  setRisk(risk: string): void {
    this.selectedRisk.set(risk);
    this.renderMarkers();
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
    this.renderMarkers();
  }

  categories(): string[] {
    return ['TODOS', ...this.disasterTypes];
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

    return this.alerts().filter((alert) => this.disasterTypes.includes(alert.categoria)).filter((alert) =>
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
      return;
    }

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.leafletMap?.setView([coords.latitude, coords.longitude], 14);
      L.circleMarker([coords.latitude, coords.longitude], {
        radius: 8,
        color: '#ffffff',
        weight: 3,
        fillColor: '#4329d6',
        fillOpacity: 1,
      }).addTo(this.leafletMap!).bindTooltip('Tu ubicación', { permanent: false });
    });
  }

  private renderMarkers(): void {
    if (!this.markerLayer) {
      return;
    }

    this.markerLayer.clearLayers();
    this.filteredAlerts()
      .filter((alert) => alert.latitud !== null && alert.longitud !== null)
      .forEach((alert) => {
        const color = alert.colorRiesgo || '#4329d6';
        const marker = L.marker([alert.latitud!, alert.longitud!], {
          icon: L.divIcon({
            className: 'alert-marker-wrapper',
            html: `<span class="alert-marker" style="--marker-color: ${color}"></span>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        });

        marker.bindPopup(`<strong>${alert.titulo}</strong><br>${alert.distrito || 'Ubicación no disponible'}<br><small>${this.riskLabel(alert.nivelRiesgo)}</small>`);
        marker.addTo(this.markerLayer!);
      });
  }
}
