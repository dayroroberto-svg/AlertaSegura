import { Component } from '@angular/core';

interface EmergencyType {
  name: string;
  description: string;
  icon: string;
  tone: string;
  count: string;
}

interface RecentAlert {
  type: string;
  description: string;
  location: string;
  risk: string;
  riskTone: string;
  date: string;
  time: string;
  status: string;
  tone: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly emergencyTypes: EmergencyType[] = [
    { name: 'Sismos', description: 'Movimientos sísmicos registrados', icon: '⌁', tone: 'mint', count: '03' },
    { name: 'Incendios', description: 'Incidentes con fuego activos', icon: '✦', tone: 'coral', count: '05' },
    { name: 'Inundaciones', description: 'Zonas afectadas por agua', icon: '≈', tone: 'blue', count: '02' },
    { name: 'Deslizamientos', description: 'Alertas de movimiento de tierra', icon: '△', tone: 'amber', count: '01' },
  ];

  readonly recentAlerts: RecentAlert[] = [
    { type: 'Incendio', description: 'Incendio reportado cerca de una zona residencial.', location: 'Av. Nicolas Ayllon, Ate', risk: 'Alto', riskTone: 'coral', date: '26 Sep 2026', time: '10:42 a. m.', status: 'Activo', tone: 'coral' },
    { type: 'Sismo', description: 'Movimiento sísmico registrado en Lima Este.', location: 'Lima Este, Peru', risk: 'Moderado', riskTone: 'amber', date: '26 Sep 2026', time: '10:18 a. m.', status: 'Activo', tone: 'amber' },
    { type: 'Inundacion', description: 'Acumulación de agua en vías principales.', location: 'Santa Anita, Lima', risk: 'Bajo', riskTone: 'blue', date: '26 Sep 2026', time: '09:55 a. m.', status: 'Monitoreado', tone: 'mint' },
  ];
}
