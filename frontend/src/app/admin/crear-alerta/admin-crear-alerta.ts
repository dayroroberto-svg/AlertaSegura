import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AdminDataService } from '../admin-data.service';
import { NivelRiesgo, Reporte } from '../admin.models';
import { AdminIcon } from '../shared/admin-icon';
import { AdminTopbar } from '../shared/admin-topbar';

interface FormularioAlerta {
  titulo: string;
  tipo: string;
  ubicacion: string;
  descripcion: string;
  nivel: NivelRiesgo;
  fecha: string;
  hora: string;
  recomendaciones: string;
  estado: string;
}

const COLOR_NIVEL: Record<NivelRiesgo, string> = { alto: '#dc2626', medio: '#ea580c', bajo: '#ca8a04' };
const FONDO_NIVEL: Record<NivelRiesgo, string> = { alto: '#fef2f2', medio: '#fff7ed', bajo: '#fefce8' };

@Component({
  selector: 'app-admin-crear-alerta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, AdminIcon, AdminTopbar],
  host: { class: 'adm-page' },
  templateUrl: './admin-crear-alerta.html',
})
export class AdminCrearAlerta {
  private readonly datos = inject(AdminDataService);
  private readonly router = inject(Router);

  readonly niveles: NivelRiesgo[] = ['alto', 'medio', 'bajo'];
  readonly tipos = ['Incendio', 'Inundación', 'Sismo', 'Deslizamiento', 'Accidente vial', 'Explosión', 'Otro'];

  readonly reporte = signal<Reporte | null>(null);
  readonly vistaPrevia = signal(false);
  readonly form = signal<FormularioAlerta>({
    titulo: '',
    tipo: '',
    ubicacion: '',
    descripcion: '',
    nivel: 'alto',
    fecha: '2024-09-03',
    hora: '10:30',
    recomendaciones:
      'Mantenga la calma y aléjese de la zona afectada. Llame al 911 si está en peligro. Siga las instrucciones de las autoridades. Evite acceder a la zona de emergencia.',
    estado: 'Activa',
  });

  constructor() {
    inject(ActivatedRoute)
      .queryParamMap.pipe(
        map((params) => params.get('reporte')),
        switchMap((id) => (id ? this.datos.obtenerReporte(id) : of(null))),
        takeUntilDestroyed(),
      )
      .subscribe((reporte) => {
        this.reporte.set(reporte);
        if (reporte) {
          this.form.update((f) => ({
            ...f,
            titulo: `Alerta: ${reporte.tipo} en ${reporte.ubicacion}`,
            tipo: reporte.tipo,
            ubicacion: reporte.ubicacion,
            descripcion: reporte.descripcion,
            nivel: reporte.gravedad,
          }));
        }
      });
  }

  actualizar<K extends keyof FormularioAlerta>(campo: K, valor: FormularioAlerta[K]): void {
    this.form.update((f) => ({ ...f, [campo]: valor }));
  }

  colorNivel(nivel: NivelRiesgo): string {
    return COLOR_NIVEL[nivel];
  }

  fondoNivel(nivel: NivelRiesgo): string {
    return FONDO_NIVEL[nivel];
  }

  etiquetaNivel(nivel: NivelRiesgo): string {
    return nivel === 'alto' ? 'Alto' : nivel === 'medio' ? 'Medio' : 'Bajo';
  }

  publicar(): void {
    const reporte = this.reporte();
    this.datos.crearAlerta({ ...this.form(), idReporte: reporte?.id }).subscribe((alerta) => {
      void this.router.navigate(['/admin/alertas/confirmacion', alerta.id]);
    });
  }
}
