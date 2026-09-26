import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

interface EmergencySummary {
  name: string;
  description: string;
  icon: string;
  count: string;
  tone: string;
}

interface RecentAlert {
  type: string;
  title: string;
  location: string;
  time: string;
  risk: string;
  tone: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly auth = inject(AuthService);

  readonly emergencyTypes: EmergencySummary[] = [
    { name: 'Sismos', description: 'Movimientos registrados', icon: '⌁', count: '03', tone: 'blue' },
    { name: 'Incendios', description: 'Incidentes activos', icon: '✦', count: '05', tone: 'coral' },
    { name: 'Inundaciones', description: 'Zonas afectadas', icon: '≈', count: '02', tone: 'sky' },
    { name: 'Deslizamientos', description: 'Alertas de tierra', icon: '△', count: '01', tone: 'sand' },
  ];

  readonly recentAlerts: RecentAlert[] = [
    { type: 'Incendio', title: 'Incidente reportado en Ate', location: 'Av. Nicolas Ayllon, Ate', time: 'Hace 18 min', risk: 'Alto', tone: 'coral' },
    { type: 'Sismo', title: 'Movimiento registrado', location: 'Lima Este, Peru', time: 'Hace 42 min', risk: 'Moderado', tone: 'sand' },
    { type: 'Inundacion', title: 'Acumulacion de agua', location: 'Santa Anita, Lima', time: 'Hace 1 h', risk: 'Bajo', tone: 'blue' },
  ];
}
