import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { Workout, Exercise } from '../../core/models/workout.model';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { ExerciseFormComponent } from './exercise-form.component';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink, PageHeaderComponent, HasRoleDirective, ExerciseFormComponent],
  template: `
    @if (workout(); as currentWorkout) {
      <app-page-header
        [title]="currentWorkout.title"
        [subtitle]="currentWorkout.description || 'Übersicht und Übungen'"
      >
        <div actions class="row">
          <a class="btn secondary" routerLink="/workouts">Zur Liste</a>
          <a
            class="btn primary"
            *appHasRole="['UPDATE']"
            [routerLink]="['/workouts', workoutId(), 'edit']"
          >
            Bearbeiten
          </a>
        </div>
      </app-page-header>

      <div class="grid grid-2">
        <section class="card card-pad stack">
          <h2 style="margin: 0;">Details</h2>

          <div class="row-between">
            <span class="muted">Datum</span>
            <strong>{{ currentWorkout.workoutDate | date: 'dd.MM.yyyy' }}</strong>
          </div>

          <div class="row-between">
            <span class="muted">Benutzer</span>
            <strong>#{{ currentWorkout.userId }}</strong>
          </div>

          <div class="row-between">
            <span class="muted">Übungen</span>
            <strong>{{ currentWorkout.exercises.length }}</strong>
          </div>
        </section>

        <section class="card card-pad stack" *appHasRole="['UPDATE']">
          <h2 style="margin: 0;">Übungen verwalten</h2>

          <p class="muted" style="margin: 0;">
            Füge neue Übungen zu diesem Workout hinzu.
          </p>

          <button class="btn primary" type="button" (click)="toggleExerciseForm()">
            {{ showForm() ? 'Formular schliessen' : 'Übung hinzufügen' }}
          </button>
        </section>
      </div>

      @if (showForm()) {
        <div style="margin-top: 18px;">
          <app-exercise-form
            (saveExercise)="addExercise($event)"
            (resetRequested)="toggleExerciseForm(false)"
          ></app-exercise-form>
        </div>
      }

      <section class="card card-pad stack" style="margin-top: 18px;">
        <h2 style="margin: 0;">Übungen</h2>

        @if (currentWorkout.exercises.length > 0) {
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Wiederholungen</th>
                <th>Dauer</th>
                <th>Gewicht</th>
                <th *appHasRole="['UPDATE']">Aktionen</th>
              </tr>
            </thead>

            <tbody>
              @for (exercise of currentWorkout.exercises; track exercise.id) {
                <tr>
                  <td>{{ exercise.name }}</td>
                  <td>{{ exercise.repetitions ?? '-' }}</td>
                  <td>{{ exercise.durationInMinutes ?? '-' }}</td>
                  <td>{{ exercise.weight ?? '-' }}</td>
                  <td *appHasRole="['UPDATE']">
                    <button class="btn danger" type="button" (click)="removeExercise(exercise)">
                      Entfernen
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <div class="empty">Noch keine Übungen vorhanden.</div>
        }
      </section>
    } @else {
      <app-page-header title="Workout Detail" subtitle="Übersicht und Übungen"></app-page-header>
      <div class="card card-pad stack">
        <div class="muted">Lade Workout...</div>
      </div>
    }
  `
})
export class WorkoutDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly workoutApi = inject(WorkoutApiService);

  readonly workoutId = signal<number>(0);
  readonly workout = signal<Workout | null>(null);
  readonly showForm = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.workoutId.set(id);
    this.reload();
  }

  reload(): void {
    this.workoutApi.getById(this.workoutId()).subscribe((workout) => this.workout.set(workout));
  }

  toggleExerciseForm(force?: boolean): void {
    this.showForm.set(force ?? !this.showForm());
  }

  addExercise(payload: {
    name: string;
    repetitions: number | null;
    durationInMinutes: number | null;
    weight: number | null;
  }): void {
    this.workoutApi.addExercise(this.workoutId(), payload).subscribe(() => {
      this.showForm.set(false);
      this.reload();
    });
  }

  removeExercise(exercise: Exercise): void {
    if (!confirm(`Übung "${exercise.name}" entfernen?`)) {
      return;
    }

    this.workoutApi.removeExercise(this.workoutId(), exercise.id).subscribe(() => this.reload());
  }

  trackByExercise(_: number, exercise: Exercise): number {
    return exercise.id;
  }
}