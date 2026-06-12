import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HasRoleDirective } from '../directives/has-role.directive';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HasRoleDirective],
  template: `
    <header class="shell">
      <div class="container shell-inner">
        <div class="row" style="gap: 24px;">
          <a class="brand" routerLink="/dashboard">Fitness Tracker</a>

          @if (loggedIn) {
            <nav class="nav">
              <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
              <a routerLink="/workouts" routerLinkActive="active">Workouts</a>
              <a
                routerLink="/users"
                routerLinkActive="active"
                *appHasRole="['READ']"
              >
                Benutzer
              </a>
            </nav>
          }
        </div>

        @if (loggedIn) {
          <div class="row" style="gap: 8px;">
            <span class="badge accent">
              {{ userName || 'angemeldet' }}
            </span>

            <button
              class="btn secondary"
              style="font-size:13px; padding: 6px 12px;"
              type="button"
              (click)="logout.emit()"
            >
              Abmelden
            </button>
          </div>
        }
      </div>
    </header>

    <main class="container page">
      <ng-content></ng-content>
    </main>
  `
})
export class ShellComponent {
  @Input() userName: string | null = null;
  @Input() roles: string[] = [];
  @Input() loggedIn = false;

  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}