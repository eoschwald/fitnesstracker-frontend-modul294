import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Exercise, ExerciseRequest } from '../../core/models/workout.model';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card card-pad stack">
      <h3 style="margin: 0;">{{ exercise ? 'Übung bearbeiten' : 'Übung hinzufügen' }}</h3>

      <form class="grid grid-2" [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label>Name</label>
          <input class="input" formControlName="name" />
        </div>

        <div class="field">
          <label>Wiederholungen</label>
          <input class="input" type="number" formControlName="repetitions" />
        </div>

        <div class="field">
          <label>Dauer (Minuten)</label>
          <input class="input" type="number" formControlName="durationInMinutes" />
        </div>

        <div class="field">
          <label>Gewicht</label>
          <input class="input" type="number" step="0.5" formControlName="weight" />
        </div>

        <div class="row" style="grid-column: 1 / -1; justify-content: space-between;">
          <button class="btn secondary" type="button" (click)="reset.emit()">Zurücksetzen</button>
          <button class="btn primary" type="submit">Speichern</button>
        </div>
      </form>
    </div>
  `
})
export class ExerciseFormComponent implements OnChanges {
  @Input() exercise: Exercise | null = null;
  @Output() saveExercise = new EventEmitter<ExerciseRequest>();
  @Output() reset = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    repetitions: [null as number | null],
    durationInMinutes: [null as number | null],
    weight: [null as number | null]
  });

  ngOnChanges(): void {
    if (!this.exercise) {
      this.form.reset({
        name: '',
        repetitions: null,
        durationInMinutes: null,
        weight: null
      });
      return;
    }

    this.form.patchValue({
      name: this.exercise.name,
      repetitions: this.exercise.repetitions,
      durationInMinutes: this.exercise.durationInMinutes,
      weight: this.exercise.weight
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.saveExercise.emit({
      name: value.name ?? '',
      repetitions: value.repetitions,
      durationInMinutes: value.durationInMinutes,
      weight: value.weight
    });
  }
}