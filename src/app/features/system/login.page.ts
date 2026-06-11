import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <app-page-header title="Login" subtitle="Melde dich über Keycloak an, um das Fitness-Tracker-Frontend zu nutzen."></app-page-header>

    <div class="card card-pad stack">
      <p class="muted">
        Die Applikation verwendet den OAuth2-Login deines bestehenden Keycloak-Servers. Nach dem Login werden die Rollen
        aus dem Access Token gelesen und für Guards, Direktiven und die Navigation verwendet.
      </p>

      <div class="row">
        <button class="btn primary" type="button" [disabled]="!auth.ready()" (click)="login()">
          Login starten
        </button>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  readonly auth = inject(AuthService);

  login(): void {
    this.auth.login();
  }
}