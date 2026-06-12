import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div>
        <h1 style="margin: 0;">{{ title }}</h1>
        @if (subtitle) {
          <p class="muted" style="margin: 6px 0 0;">{{ subtitle }}</p>
        }
      </div>

      <div class="row">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle: string | null = null;
}