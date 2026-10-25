import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EstadoAlerta, EstadoReporte, NivelRiesgo } from '../admin.models';

@Component({
  selector: 'app-admin-risk-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `<span [class]="'badge ' + clase()">{{ etiqueta() }}</span>`,
})
export class AdminRiskBadge {
  readonly level = input.required<NivelRiesgo>();

  clase(): string {
    const level = this.level();
    return level === 'alto' ? 'risk-high' : level === 'medio' ? 'risk-med' : 'risk-low';
  }

  etiqueta(): string {
    const level = this.level();
    return level === 'alto' ? 'Alto' : level === 'medio' ? 'Medio' : 'Bajo';
  }
}

@Component({
  selector: 'app-admin-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `<span [class]="'badge ' + clase()">{{ etiqueta() }}</span>`,
})
export class AdminStatusBadge {
  readonly status = input.required<EstadoReporte>();

  clase(): string {
    const status = this.status();
    return status === 'revision' ? 'status-review' : status === 'verificado' ? 'status-verified' : 'status-rejected';
  }

  etiqueta(): string {
    const status = this.status();
    return status === 'revision' ? 'En revisión' : status === 'verificado' ? 'Verificado' : 'Rechazado';
  }
}

@Component({
  selector: 'app-admin-alert-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `<span [class]="'badge ' + clase()">{{ etiqueta() }}</span>`,
})
export class AdminAlertStatusBadge {
  readonly status = input.required<EstadoAlerta>();

  clase(): string {
    const status = this.status();
    return status === 'activa' ? 'status-verified' : status === 'finalizada' ? 'status-review' : 'status-neutral';
  }

  etiqueta(): string {
    const status = this.status();
    return status === 'activa' ? 'Activa' : status === 'finalizada' ? 'Finalizada' : 'Archivada';
  }
}
