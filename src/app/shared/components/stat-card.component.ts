import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="kpi">
      <div class="label">{{ label }}</div>
      <div class="value">{{ value }}</div>
      @if (hint) {
        <div class="hint">{{ hint }}</div>
      }
    </div>
  `
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
  @Input() hint: string | null = null;
}