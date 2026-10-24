import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface InformacionPrevencion {
  idInformacion: number;
  categoria: string;
  titulo: string;
  antes: string;
  durante: string;
  despues: string;
  fechaActualizacion?: string;
}

export interface CategoriaPrevencion {
  nombre: string;
  label: string;
  icono: string;
}

const CATALOGO: CategoriaPrevencion[] = [
  { nombre: 'SISMOS', label: 'Sismos', icono: '🌎' },
  { nombre: 'INCENDIOS', label: 'Incendios', icono: '🔥' },
  { nombre: 'INUNDACIONES', label: 'Inundaciones', icono: '🌊' },
  { nombre: 'PRIMEROS_AUXILIOS', label: 'Primeros auxilios', icono: '🚑' },
  { nombre: 'SEGURIDAD_CIUDADANA', label: 'Seguridad ciudadana', icono: '🛡️' },
];

@Component({
  selector: 'app-prevention',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prevention.html',
  styleUrl: './prevention.css',
})
export class Prevention implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/informacion-prevencion`;

  guias = signal<InformacionPrevencion[]>([]);
  categoriaSeleccionada = signal<string>('SISMOS');
  loading = signal<boolean>(true);

  categoriasDisponibles = computed<CategoriaPrevencion[]>(() => {
    const publicadas = new Set(this.guias().map((guia) => guia.categoria));
    return CATALOGO.filter((categoria) => publicadas.has(categoria.nombre));
  });

  guiaActual = computed<InformacionPrevencion | undefined>(() => {
    return this.guias().find((guia) => guia.categoria === this.categoriaSeleccionada());
  });

  categoriaActual = computed<CategoriaPrevencion>(() => {
    const seleccionada = CATALOGO.find((categoria) => categoria.nombre === this.categoriaSeleccionada());
    return seleccionada ?? CATALOGO[0];
  });

  ngOnInit(): void {
    this.cargarPrevencion();
  }

  cargarPrevencion(): void {
    this.loading.set(true);
    this.http.get<ApiResponse<InformacionPrevencion[]>>(this.apiUrl).subscribe({
      next: (response) => {
        this.guias.set(response.data ?? []);
        this.seleccionarPrimeraDisponible();
        this.loading.set(false);
      },
      error: () => {
        this.guias.set([
          {
            idInformacion: 1,
            categoria: 'SISMOS',
            titulo: '¿Qué hacer ante un sismo?',
            antes: 'Identifica las zonas seguras de tu hogar y centro de trabajo.|Prepara una mochila de emergencia con agua, linterna, botiquín, documentos y radio a pilas.|Participa activamente en simulacros.|Asegura muebles pesados y objetos que puedan caer.|Establece un punto de encuentro familiar.',
            durante: 'Mantén la calma y no corras.|Ubícate en la zona segura identificada (columnas, vigas, marcos de puertas).|Si estás en un edificio, aléjate de ventanas y objetos que puedan caer.|Si estás en la calle, aléjate de postes, cables y edificios.|Protege tu cabeza con los brazos o un objeto resistente.',
            despues: 'Revisa si hay daños estructurales antes de ingresar.|No uses ascensores.|Verifica que no haya fugas de gas o cortocircuitos.|Atiende a personas heridas si puedes hacerlo con seguridad.|Mantente informado por fuentes oficiales.',
          },
          {
            idInformacion: 2,
            categoria: 'INCENDIOS',
            titulo: '¿Qué hacer ante un incendio?',
            antes: 'Instala detectores de humo en tu hogar.|Ten un extintor vigente y aprende a usarlo.|Conoce las rutas de evacuación.|No sobrecargues las tomas de corriente.|Revisa periódicamente las instalaciones eléctricas y de gas.',
            durante: 'Llama inmediatamente a los bomberos (116).|Sal del lugar agachado para evitar el humo.|Cubre tu nariz y boca con un paño húmedo.|No uses ascensores.|Toca las puertas antes de abrirlas: si están calientes, no las abras.',
            despues: 'No regreses al lugar hasta que los bomberos lo autoricen.|Ventila los ambientes afectados.|Revisa las instalaciones antes de reconectar servicios.|Documenta los daños para el seguro.|Busca apoyo emocional si lo necesitas.',
          },
        ]);
        this.seleccionarPrimeraDisponible();
        this.loading.set(false);
      },
    });
  }

  seleccionarCategoria(nombre: string): void {
    this.categoriaSeleccionada.set(nombre);
  }

  private seleccionarPrimeraDisponible(): void {
    const disponibles = this.categoriasDisponibles();
    if (disponibles.length > 0 && !disponibles.some((cat) => cat.nombre === this.categoriaSeleccionada())) {
      this.categoriaSeleccionada.set(disponibles[0].nombre);
    }
  }

  obtenerListaPuntos(texto: string | undefined): string[] {
    if (!texto) return [];
    if (texto.includes('|')) return texto.split('|').map((item) => item.trim()).filter((item) => item.length > 0);
    return texto.split('.').map((item) => item.trim()).filter((item) => item.length > 0);
  }
}
