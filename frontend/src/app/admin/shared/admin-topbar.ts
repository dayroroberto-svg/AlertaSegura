import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AdminDataService } from '../admin-data.service';
import { AdminIcon } from './admin-icon';

@Component({
  selector: 'app-admin-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminIcon, RouterLink],
  host: { style: 'display: block' },
  template: `
    <div style="background: white; border-bottom: 1px solid var(--border); padding: 16px 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px">
      <div>
        <h1 style="font-size: 20px; font-weight: 700; color: var(--text); margin: 0">{{ title() }}</h1>
        @if (subtitle()) {
          <p style="font-size: 13px; color: var(--text-muted); margin: 2px 0 0">{{ subtitle() }}</p>
        }
      </div>
      <div style="display: flex; align-items: center; gap: 10px">
        <ng-content />
        <a
          routerLink="/admin/reportes"
          [attr.aria-label]="pendientes() > 0 ? pendientes() + ' reportes por revisar' : 'No hay reportes por revisar'"
          [title]="pendientes() > 0 ? pendientes() + ' reportes por revisar' : 'No hay reportes por revisar'"
          style="width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative"
        >
          <app-admin-icon name="bell" [size]="16" color="#64748b" />
          @if (pendientes() > 0) {
            <span style="position: absolute; top: -6px; right: -6px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: #dc2626; color: white; font-size: 11px; font-weight: 700; line-height: 18px; text-align: center; border: 1.5px solid white; box-sizing: border-box">{{ pendientes() > 99 ? '99+' : pendientes() }}</span>
          }
        </a>
      </div>
    </div>
  `,
})
export class AdminTopbar {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  // La campana cuenta los reportes que esperan revisión y lleva a la lista
  readonly pendientes = toSignal(inject(AdminDataService).contarPendientes().pipe(catchError(() => of(0))), { initialValue: 0 });
}
