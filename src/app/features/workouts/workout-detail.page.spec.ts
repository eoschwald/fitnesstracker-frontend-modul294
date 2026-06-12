import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { WorkoutDetailPageComponent } from './workout-detail.page';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { AuthService } from '../../core/services/auth.service';
import { createAuthServiceMock } from '../../../testing/test-helpers';

describe('WorkoutDetailPageComponent', () => {
  let fixture: ComponentFixture<WorkoutDetailPageComponent>;
  const api = {
    getById: vi.fn(() =>
      of({
        id: 7,
        title: 'Push Day',
        description: 'Upper body',
        workoutDate: '2026-06-10',
        userId: 1,
        exercises: [{ id: 1, name: 'Bench', repetitions: 10, durationInMinutes: 20, weight: 40 }]
      })
    ),
    addExercise: vi.fn(() => of({ id: 2, name: 'Press', repetitions: 8, durationInMinutes: 15, weight: 30 })),
    removeExercise: vi.fn(() => of(void 0))
  };
  const authMock = createAuthServiceMock({ hasAnyRole: vi.fn(() => true) });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDetailPageComponent],
      providers: [
        provideRouter([]),
        { provide: WorkoutApiService, useValue: api },
        { provide: AuthService, useValue: authMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '7' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutDetailPageComponent);
  });

  it('should create and load the workout', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.workoutId()).toBe(7);
    expect(fixture.componentInstance.workout()?.title).toBe('Push Day');
  });

  it('toggles the exercise form', () => {
    fixture.componentInstance.toggleExerciseForm(true);
    expect(fixture.componentInstance.showForm()).toBe(true);
    fixture.componentInstance.toggleExerciseForm();
    expect(fixture.componentInstance.showForm()).toBe(false);
  });

  it('adds and removes exercises', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.detectChanges();

    fixture.componentInstance.addExercise({
      name: 'Press',
      repetitions: 8,
      durationInMinutes: 15,
      weight: 30
    });
    expect(api.addExercise).toHaveBeenCalledWith(7, {
      name: 'Press',
      repetitions: 8,
      durationInMinutes: 15,
      weight: 30
    });
    expect(fixture.componentInstance.showForm()).toBe(false);

    fixture.componentInstance.removeExercise({
      id: 1,
      name: 'Bench',
      repetitions: 10,
      durationInMinutes: 20,
      weight: 40
    });
    expect(api.removeExercise).toHaveBeenCalledWith(7, 1);
  });
});