import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  template: `
    <app-page-header title="Kein Zugriff" subtitle="Für diese Seite fehlen dir die nötigen Rollen."></app-page-header>
    <div class="card card-pad stack">
      <p class="muted">Bitte melde dich mit einem Benutzer an, der die geforderte Rolle besitzt.</p>
      <a class="btn primary" routerLink="/dashboard">Zurück zum Dashboard</a>
    </div>
  `
})
export class ForbiddenPageComponent {}
