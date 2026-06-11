import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UserApiService } from '../../core/services/user-api.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  template: `
    <app-page-header
      [title]="isEditMode ? 'Benutzer bearbeiten' : 'Benutzer erstellen'"
      subtitle="Einfacher Name für die Zuordnung von Workouts."
    ></app-page-header>

    <div class="card card-pad stack" *ngIf="loadError" style="margin-bottom: 16px;">
      <div class="error">{{ loadError }}</div>
    </div>

    <div class="card card-pad stack">
      <form class="stack" [formGroup]="form" (ngSubmit)="save()">
        <div class="field">
          <label for="username">Username</label>
          <input id="username" class="input" formControlName="username" />
          <div class="error" *ngIf="username.invalid && username.touched">
            Username ist erforderlich (max. 100 Zeichen).
          </div>
        </div>

        <div class="row" style="justify-content: space-between;">
          <a class="btn secondary" routerLink="/users">Abbrechen</a>
          <button class="btn primary" type="submit" [disabled]="form.invalid || saving">Speichern</button>
        </div>
      </form>
    </div>
  `
})
export class UserFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(UserApiService);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(100)]]
  });

  isEditMode = false;
  saving = false;
  loadError: string | null = null;
  private userId: number | null = null;

  get username() {
    return this.form.controls.username;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = Number.isFinite(id) && id > 0;
    this.userId = this.isEditMode ? id : null;

    if (this.userId == null) {
      return;
    }

    this.api
      .getById(this.userId)
      .pipe(
        catchError((error) => {
          console.error('Benutzer konnte nicht geladen werden.', error);
          this.loadError = 'Benutzer konnte nicht geladen werden.';
          return of(null);
        })
      )
      .subscribe((user) => {
        if (user) {
          this.form.patchValue({ username: user.username });
        }
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.loadError = null;

    const payload = { username: this.username.value };
    const request$ =
      this.isEditMode && this.userId != null
        ? this.api.update(this.userId, payload)
        : this.api.create(payload);

    request$.subscribe({
      next: () => void this.router.navigate(['/users']),
      error: (error) => {
        console.error('Benutzer konnte nicht gespeichert werden.', error);
        this.loadError = 'Benutzer konnte nicht gespeichert werden.';
        this.saving = false;
      }
    });
  }
}