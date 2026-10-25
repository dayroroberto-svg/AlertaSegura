import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosService } from '../../core/data/datos.service';

interface ContactoApi {
  idContacto: number;
  tipoContacto: string;
  nombreInstitucion: string;
  telefono: string;
  direccion?: string;
  distrito?: string;
  descripcion?: string;
}

export interface Contacto {
  idContacto: number;
  nombreInstitucion: string;
  numero: string;
  descripcion?: string;
  tipoNombre?: string;
  theme?: 'blue' | 'red' | 'green' | 'orange' | 'teal' | 'purple';
  emoji?: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts implements OnInit {
  private readonly datos = inject(DatosService);

  contactos = signal<Contacto[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarContactos();
  }

  cargarContactos(): void {
    this.loading.set(true);
    this.datos.contactos().then(
      (filas) => {
        this.contactos.set(
          this.asignarEstilos(
            filas.map((fila) => ({
              idContacto: fila.id_contacto,
              tipoContacto: fila.tipos_contacto?.nombre ?? '',
              nombreInstitucion: fila.nombre_institucion,
              telefono: fila.telefono ?? '',
              direccion: fila.direccion ?? undefined,
              distrito: fila.distrito ?? undefined,
              descripcion: fila.descripcion ?? undefined,
            })),
          ),
        );
        this.loading.set(false);
      },
      () => {
        this.contactos.set([
          { idContacto: 1, nombreInstitucion: 'Policía Nacional', numero: '105', descripcion: 'Seguridad ciudadana y orden público', theme: 'blue', emoji: '👮' },
          { idContacto: 2, nombreInstitucion: 'Bomberos del Perú', numero: '116', descripcion: 'Incendios, rescates y emergencias', theme: 'red', emoji: '🚒' },
          { idContacto: 3, nombreInstitucion: 'SAMU / Ambulancia', numero: '106', descripcion: 'Atención médica de emergencia', theme: 'green', emoji: '🚑' },
          { idContacto: 4, nombreInstitucion: 'INDECI', numero: '115', descripcion: 'Defensa Civil — gestión de desastres', theme: 'orange', emoji: '🛡️' },
          { idContacto: 6, nombreInstitucion: 'Cruz Roja Peruana', numero: '265-8783', descripcion: 'Ayuda humanitaria y primeros auxilios', theme: 'red', emoji: '➕' },
          { idContacto: 7, nombreInstitucion: 'Hospital Nacional', numero: '411-8000', descripcion: 'Emergencias médicas complejas 24h', theme: 'blue', emoji: '🏥' },
          { idContacto: 8, nombreInstitucion: 'Línea de emergencias', numero: '911', descripcion: 'Central unificada — disponible 24/7', theme: 'purple', emoji: '📞' },
        ]);
        this.loading.set(false);
      },
    );
  }

  private asignarEstilos(data: ContactoApi[]): Contacto[] {
    return data.map((item) => {
      const contacto: Contacto = {
        idContacto: item.idContacto,
        nombreInstitucion: item.nombreInstitucion,
        numero: item.telefono,
        descripcion: item.descripcion,
        tipoNombre: item.tipoContacto,
      };
      const nombre = item.nombreInstitucion.toLowerCase();
      if (nombre.includes('policía') || nombre.includes('pnp') || nombre.includes('comisaría') || nombre.includes('hospital')) {
        return { ...contacto, theme: 'blue', emoji: nombre.includes('hospital') ? '🏥' : '👮' };
      }
      if (nombre.includes('bomberos') || nombre.includes('cruz roja')) return { ...contacto, theme: 'red', emoji: '🚒' };
      if (nombre.includes('samu') && item.telefono === '117') return { ...contacto, theme: 'green', emoji: '🚑' };
      if (nombre.includes('samu') || nombre.includes('ambulancia')) return { ...contacto, theme: 'teal', emoji: '🏥' };
      if (nombre.includes('indeci') || nombre.includes('defensa civil')) return { ...contacto, theme: 'orange', emoji: '🛡️' };
      if (nombre.includes('serenazgo')) return { ...contacto, theme: 'purple', emoji: '🚨' };
      if (nombre.includes('911') || nombre.includes('línea')) return { ...contacto, theme: 'purple', emoji: '📞' };
      return { ...contacto, theme: 'blue', emoji: '📞' };
    });
  }

  llamar(numero: string): void {
    window.location.href = `tel:${numero}`;
  }
}
