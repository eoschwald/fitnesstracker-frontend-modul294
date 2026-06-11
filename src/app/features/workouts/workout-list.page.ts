import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { UserApiService } from '../../core/services/user-api.service';
import { Workout } from '../../core/models/workout.model';
import { User } from '../../core/models/user.model';
import { forkJoin } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink, PageHeaderComponent, HasRoleDirective],
  template: `
    <app-page-header title="Workouts" subtitle="Liste aller Trainings mit schnellen Aktionen.">
      <div actions class="row">
        <input class="input" style="min-width: 240px;" type="search" placeholder="Suche..." [value]="query()" (input)="setQuery(search.value)" #search />
        <a class="btn primary" routerLink="/workouts/new" *appHasRole="['UPDATE']">Workout anlegen</a>
      </div>
    </app-page-header>

    <div class="card card-pad stack">
      <div *ngIf="loading()" class="muted">Lade Daten...</div>

      <div *ngIf="!loading() && filteredWorkouts().length === 0" class="empty">
        Keine Workouts gefunden.
      </div>

      <table class="table" *ngIf="filteredWorkouts().length > 0">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Datum</th>
            <th>Benutzer</th>
            <th>Übungen</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let workout of filteredWorkouts(); trackBy: trackByWorkout">
            <td>
              <strong>{{ workout.title }}</strong>
              <div class="muted">{{ workout.description || 'Keine Beschreibung' }}</div>
            </td>
            <td>{{ workout.workoutDate | date: 'dd.MM.yyyy' }}</td>
            <td>{{ userName(workout.userId) }}</td>
            <td><span class="badge">{{ workout.exercises?.length || 0 }}</span></td>
            <td>
              <div class="table-actions">
                <a class="btn secondary" [routerLink]="['/workouts', workout.id]">Öffnen</a>
                <a class="btn secondary" [routerLink]="['/workouts', workout.id, 'edit']" *appHasRole="['UPDATE']">Bearbeiten</a>
                <button class="btn danger" type="button" *appHasRole="['UPDATE']" (click)="deleteWorkout(workout)">Löschen</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class WorkoutListPageComponent implements OnInit {
  private readonly workoutApi = inject(WorkoutApiService);
  private readonly userApi = inject(UserApiService);

  readonly loading = signal(false);
  readonly query = signal('');
  readonly workouts = signal<Workout[]>([]);
  readonly users = signal<User[]>([]);
  readonly filteredWorkouts = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.workouts();
    return this.workouts().filter((workout) =>
      [workout.title, workout.description ?? '', this.userName(workout.userId)]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    forkJoin({ workouts: this.workoutApi.getAll(), users: this.userApi.getAll() }).subscribe({
      next: ({ workouts, users }) => {
        this.workouts.set(workouts);
        this.users.set(users);
      },
      error: () => {
        this.workouts.set([]);
        this.users.set([]);
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }

  setQuery(value: string): void {
    this.query.set(value);
  }

  userName(userId: number): string {
    return this.users().find((user) => user.id === userId)?.username ?? `#${userId}`;
  }

  deleteWorkout(workout: Workout): void {
    if (!confirm(`Workout "${workout.title}" wirklich löschen?`)) {
      return;
    }

    this.workoutApi.delete(workout.id).subscribe(() => this.reload());
  }

  trackByWorkout(_: number, workout: Workout): number {
    return workout.id;
  }
}
