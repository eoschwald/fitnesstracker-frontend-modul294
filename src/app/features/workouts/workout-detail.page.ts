import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { Workout, Exercise } from '../../core/models/workout.model';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { ExerciseFormComponent } from './exercise-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, DatePipe, RouterLink, PageHeaderComponent, HasRoleDirective, ExerciseFormComponent],
  template: `
    <app-page-header [title]="workout()?.title || 'Workout Detail'" [subtitle]="workout()?.description || 'Übersicht und Übungen'">
      <div actions class="row">
        <a class="btn secondary" routerLink="/workouts">Zur Liste</a>
        <a class="btn primary" *appHasRole="['UPDATE']" [routerLink]="['/workouts', workoutId(), 'edit']">Bearbeiten</a>
      </div>
    </app-page-header>

    <div class="grid grid-2">
      <section class="card card-pad stack">
        <h2 style="margin: 0;">Details</h2>
        <div class="row-between"><span class="muted">Datum</span><strong>{{ workout()?.workoutDate | date:'dd.MM.yyyy' }}</strong></div>
        <div class="row-between"><span class="muted">Benutzer</span><strong>#{{ workout()?.userId }}</strong></div>
        <div class="row-between"><span class="muted">Übungen</span><strong>{{ workout()?.exercises?.length || 0 }}</strong></div>
      </section>

      <section class="card card-pad stack" *appHasRole="['UPDATE']">
        <h2 style="margin: 0;">Schnellaktion</h2>
        <p class="muted">Die Übungen werden direkt über die REST-Routen des Backends verwaltet.</p>
        <button class="btn primary" type="button" (click)="toggleExerciseForm()">{{ showForm() ? 'Formular schliessen' : 'Übung hinzufügen' }}</button>
      </section>
    </div>

    <div style="margin-top: 18px;" *ngIf="showForm() && workout()">
      <app-exercise-form (saveExercise)="addExercise($event)" (reset)="toggleExerciseForm(false)"></app-exercise-form>
    </div>

    <section class="card card-pad stack" style="margin-top: 18px;">
      <h2 style="margin: 0;">Übungen</h2>
      <div *ngIf="!workout()" class="muted">Lade Workout...</div>
      <table class="table" *ngIf="workout()?.exercises?.length">
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
          <tr *ngFor="let exercise of workout()?.exercises; trackBy: trackByExercise">
            <td>{{ exercise.name }}</td>
            <td>{{ exercise.repetitions ?? '-' }}</td>
            <td>{{ exercise.durationInMinutes ?? '-' }}</td>
            <td>{{ exercise.weight ?? '-' }}</td>
            <td *appHasRole="['UPDATE']">
              <button class="btn danger" type="button" (click)="removeExercise(exercise)">Entfernen</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="empty" *ngIf="workout()?.exercises?.length === 0">Noch keine Übungen vorhanden.</div>
    </section>
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

  addExercise(payload: { name: string; repetitions: number | null; durationInMinutes: number | null; weight: number | null; }): void {
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
