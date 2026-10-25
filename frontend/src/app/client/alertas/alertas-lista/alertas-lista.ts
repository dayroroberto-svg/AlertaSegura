import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '../alertas.service';
import { AlertaCard } from '../alerta-card/alerta-card';
import { Alerta, CATEGORIAS_ALERTA, ETIQUETA_RIESGO, NivelRiesgo } from '../alerta.model';

@Component({
  selector: 'app-alertas-lista',
  imports: [AlertaCard],
  templateUrl: './alertas-lista.html',
  styleUrl: './alertas-lista.css',
})
export class AlertasLista {
  private readonly alertasService = inject(AlertasService);

  // Filtros iniciales desde la query string (/alertas?categoria=Sismo&riesgo=ALTO).
  private readonly parametros = toSignal(inject(ActivatedRoute).queryParamMap);

  readonly categorias = CATEGORIAS_ALERTA;
  readonly niveles = Object.entries(ETIQUETA_RIESGO) as [NivelRiesgo, string][];

  readonly alertas = toSignal(this.alertasService.listar(), { initialValue: [] as Alerta[] });
  readonly periodos = [
    { valor: '', etiqueta: 'Todo el tiempo' },
    { valor: '24h', etiqueta: 'Últimas 24h' },
    { valor: '7d', etiqueta: 'Última semana' },
    { valor: '30d', etiqueta: 'Último mes' },
  ];
  private readonly horasPeriodo: Record<string, number> = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30 };

  readonly categoria = signal('');
  readonly periodo = signal('');
  readonly riesgo = signal<NivelRiesgo | ''>('');

  readonly filtradas = computed(() =>
    this.alertas().filter(
      (alerta) =>
        (!this.categoria() || alerta.categoria === this.categoria()) &&
        (!this.riesgo() || alerta.nivelRiesgo === this.riesgo()) &&
        this.dentroDelPeriodo(alerta),
    ),
  );

  constructor() {
    effect(() => {
      const categoria = this.parametros()?.get('categoria') ?? '';
      const riesgo = this.parametros()?.get('riesgo') ?? '';
      this.categoria.set(this.categorias.includes(categoria) ? categoria : '');
      this.riesgo.set(this.niveles.some(([nivel]) => nivel === riesgo) ? (riesgo as NivelRiesgo) : '');
    });
  }

  alCambiarCategoria(evento: Event): void {
    this.categoria.set((evento.target as HTMLSelectElement).value);
  }

  alCambiarRiesgo(evento: Event): void {
    this.riesgo.set((evento.target as HTMLSelectElement).value as NivelRiesgo | '');
  }

  alCambiarPeriodo(evento: Event): void {
    this.periodo.set((evento.target as HTMLSelectElement).value);
  }

  limpiar(): void {
    this.periodo.set('');
    this.categoria.set('');
    this.riesgo.set('');
  }

  private dentroDelPeriodo(alerta: Alerta): boolean {
    const horas = this.horasPeriodo[this.periodo()];
    return !horas || Date.now() - new Date(alerta.fechaPublicacion).getTime() <= horas * 3_600_000;
  }
}
