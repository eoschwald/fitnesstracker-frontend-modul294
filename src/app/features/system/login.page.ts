import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-icon" aria-hidden="true">🏋️</div>
        <h1>Login</h1>

        <button
          class="login-button"
          type="button"
          [disabled]="!auth.ready()"
          (click)="login()"
        >
          Login mit Keycloak
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 72px);
      background: #f8f9fb;
    }

    .login-page {
      min-height: calc(100vh - 72px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
    }

    .login-card {
      width: min(100%, 420px);
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      padding: 44px 36px;
      text-align: center;
    }

    .login-icon {
      font-size: 56px;
      line-height: 1;
      margin-bottom: 18px;
      color: #f2c200;
    }

    h1 {
      margin: 0 0 28px;
      font-size: 2rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .login-button {
      appearance: none;
      border: 0;
      border-radius: 10px;
      background: #161616;
      color: #fff;
      font: inherit;
      font-weight: 600;
      padding: 14px 22px;
      min-width: 220px;
      cursor: pointer;
      transition: transform 0.08s ease, opacity 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.14);
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .login-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 32px 22px;
      }

      h1 {
        font-size: 1.75rem;
      }

      .login-button {
        width: 100%;
      }
    }
  `]
})
export class LoginPageComponent {
  readonly auth = inject(AuthService);

  login(): void {
    this.auth.login();
  }
}