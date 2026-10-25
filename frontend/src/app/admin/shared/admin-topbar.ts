import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AdminIcon } from './admin-icon';

@Component({
  selector: 'app-admin-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminIcon],
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
        <div style="width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative">
          <app-admin-icon name="bell" [size]="16" color="#64748b" />
          <div style="position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; background: #dc2626; border: 1.5px solid white"></div>
        </div>
      </div>
    </div>
  `,
})
export class AdminTopbar {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
