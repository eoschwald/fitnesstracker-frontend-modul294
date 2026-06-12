import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { UserApiService } from '../../core/services/user-api.service';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';

@Component({
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, StatCardComponent, HasRoleDirective],
  template: `
    <app-page-header title="Dashboard" subtitle="Übersicht über deine Trainings."></app-page-header>

    <div class="grid grid-3" style="margin-bottom: 24px;">
      <app-stat-card label="Workouts" [value]="workoutCount() + ''" hint="gesamt erfasst" />
      <app-stat-card label="Übungen" [value]="exerciseCount() + ''" hint="über alle Workouts" />
      <app-stat-card label="Benutzer" [value]="userCount() + ''" hint="registriert" />
    </div>

    <div class="grid grid-2">
      <section class="card card-pad stack">
        <h2 style="font-size: 16px;">Schnellaktionen</h2>
        <p class="muted" style="margin: 0;">
          Verwalte deine Trainingsdaten direkt über die wichtigsten Funktionen.
        </p>
        <div class="row" style="margin-top: 4px;">
          <a class="btn primary" routerLink="/workouts/new" *appHasRole="['UPDATE']">Workout erstellen</a>
          <a class="btn secondary" routerLink="/users">Benutzer verwalten</a>
        </div>
      </section>

      <section class="card card-pad stack">
        <h2 style="font-size: 16px;">Statistik</h2>
        <table style="border-collapse: collapse; font-size: 14px; width: 100%;">
          <tr>
            <td style="padding: 7px 0; color: var(--muted); border-bottom: 1px solid var(--border);">Workouts</td>
            <td style="padding: 7px 0; text-align: right; font-family: 'DM Mono', monospace; border-bottom: 1px solid var(--border);">
              {{ workoutCount() }}
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: var(--muted); border-bottom: 1px solid var(--border);">Übungen</td>
            <td style="padding: 7px 0; text-align: right; font-family: 'DM Mono', monospace; border-bottom: 1px solid var(--border);">
              {{ exerciseCount() }}
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: var(--muted);">Benutzer</td>
            <td style="padding: 7px 0; text-align: right; font-family: 'DM Mono', monospace;">
              {{ userCount() }}
            </td>
          </tr>
        </table>
      </section>
    </div>
  `
})
export class DashboardPageComponent {
  private readonly workouts = inject(WorkoutApiService);
  private readonly users = inject(UserApiService);

  readonly workoutCount = signal(0);
  readonly exerciseCount = signal(0);
  readonly userCount = signal(0);

  constructor() {
    void this.reload();
  }

  reload(): void {
    forkJoin({
      workouts: this.workouts.getAll().pipe(catchError(() => of([]))),
      users: this.users.getAll().pipe(catchError(() => of([])))
    }).subscribe(({ workouts, users }) => {
      this.workoutCount.set(workouts.length);
      this.userCount.set(users.length);
      this.exerciseCount.set(
        workouts.reduce((sum, workout) => sum + (workout.exercises?.length ?? 0), 0)
      );
    });
  }
}