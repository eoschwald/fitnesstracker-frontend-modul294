import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellComponent } from './shared/components/shell.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShellComponent],
  template: `
    <app-shell [userName]="auth.userName()" [roles]="auth.roles()" [loggedIn]="auth.isLoggedIn()" (login)="auth.login()" (logout)="auth.logout()">
      <router-outlet></router-outlet>
    </app-shell>
  `
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
}
