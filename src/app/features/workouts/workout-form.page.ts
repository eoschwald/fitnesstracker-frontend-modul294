import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { UserApiService } from '../../core/services/user-api.service';
import { User } from '../../core/models/user.model';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  template: `
    <app-page-header [title]="isEditMode ? 'Workout bearbeiten' : 'Workout erstellen'" subtitle="Pflichtfelder werden clientseitig validiert."></app-page-header>

    <div class="card card-pad stack" *ngIf="ready">
      <form class="grid grid-2" [formGroup]="form" (ngSubmit)="save()">
        <div class="field">
          <label for="title">Titel</label>
          <input id="title" class="input" formControlName="title" />
          <div class="error" *ngIf="title.invalid && title.touched">Titel ist erforderlich (max. 150 Zeichen).</div>
        </div>

        <div class="field">
          <label for="workoutDate">Datum</label>
          <input id="workoutDate" class="input" type="date" formControlName="workoutDate" />
          <div class="error" *ngIf="workoutDate.invalid && workoutDate.touched">Bitte ein gültiges Datum wählen.</div>
        </div>

        <div class="field grid-2" style="grid-column: 1 / -1;">
          <div class="field">
            <label for="userId">Benutzer</label>
            <select id="userId" class="select" formControlName="userId">
              <option value="">Bitte wählen</option>
              <option *ngFor="let user of users" [value]="user.id">{{ user.username }}</option>
            </select>
            <div class="error" *ngIf="userId.invalid && userId.touched">Benutzer ist erforderlich.</div>
          </div>

          <div class="field">
            <label for="description">Beschreibung</label>
            <textarea id="description" class="textarea" formControlName="description"></textarea>
            <div class="muted">Optional, max. 500 Zeichen.</div>
          </div>
        </div>

        <div class="row" style="grid-column: 1 / -1; justify-content: space-between;">
          <a class="btn secondary" routerLink="/workouts">Abbrechen</a>
          <button class="btn primary" type="submit" [disabled]="form.invalid || saving">Speichern</button>
        </div>
      </form>
    </div>

    <div class="card card-pad" *ngIf="!ready">Lade Formular...</div>
  `
})
export class WorkoutFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workoutApi = inject(WorkoutApiService);
  private readonly userApi = inject(UserApiService);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
    workoutDate: ['', [Validators.required]],
    userId: ['', [Validators.required]]
  });

  users: User[] = [];
  ready = false;
  saving = false;
  isEditMode = false;
  private workoutId: number | null = null;

  get title() { return this.form.controls.title; }
  get description() { return this.form.controls.description; }
  get workoutDate() { return this.form.controls.workoutDate; }
  get userId() { return this.form.controls.userId; }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = Number.isFinite(id) && id > 0;
    this.workoutId = this.isEditMode ? id : null;

    forkJoin({ users: this.userApi.getAll(), workout: this.isEditMode ? this.workoutApi.getById(id) : of(null) }).subscribe(({ users, workout }) => {
      this.users = users;
      if (this.isEditMode && workout) {
        this.form.patchValue({
          title: workout.title,
          description: workout.description ?? '',
          workoutDate: workout.workoutDate,
          userId: String(workout.userId)
        });
      }
      this.ready = true;
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = {
      title: this.title.value,
      description: this.description.value || null,
      workoutDate: this.workoutDate.value,
      userId: Number(this.userId.value)
    };

    const request$ = this.isEditMode && this.workoutId != null
      ? this.workoutApi.update(this.workoutId, payload)
      : this.workoutApi.create(payload);

    request$.subscribe({
      next: (workout) => void this.router.navigate(['/workouts', workout.id]),
      error: () => (this.saving = false)
    });
  }
}
