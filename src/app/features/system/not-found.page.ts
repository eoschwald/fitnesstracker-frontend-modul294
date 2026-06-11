import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero">
      <h1>404</h1>
      <p>Die gesuchte Seite wurde nicht gefunden.</p>
      <a class="btn primary" routerLink="/dashboard">Zum Dashboard</a>
    </div>
  `
})
export class NotFoundPageComponent {}
