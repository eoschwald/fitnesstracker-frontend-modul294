import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgIf],
  template: `
    <section class="hero" [style.marginBottom]="compact ? '16px' : '24px'">
      <div class="row-between">
        <div>
          <h1 class="page-title">{{ title }}</h1>
          <p class="page-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <ng-content select="[actions]"></ng-content>
      </div>
    </section>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle: string | null = null;
  @Input() compact = false;
}
