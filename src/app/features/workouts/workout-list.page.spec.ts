import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { WorkoutListPageComponent } from './workout-list.page';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { UserApiService } from '../../core/services/user-api.service';
import { AuthService } from '../../core/services/auth.service';
import { createAuthServiceMock } from '../../../testing/test-helpers';
import { Workout } from '../../core/models/workout.model';

describe('WorkoutListPageComponent', () => {
  let fixture: ComponentFixture<WorkoutListPageComponent>;

  const workoutApi = {
    getAll: vi.fn(() =>
      of([
        { id: 1, title: 'Push', description: 'Upper body', workoutDate: '2026-06-10', userId: 1, exercises: [] },
        {
          id: 2,
          title: 'Run',
          description: 'Cardio',
          workoutDate: '2026-06-11',
          userId: 1,
          exercises: [{ id: 1, name: 'Warmup', repetitions: 1, durationInMinutes: 10, weight: null }]
        }
      ])
    ),
    delete: vi.fn(() => of(void 0))
  };

  const userApi = { getAll: vi.fn(() => of([{ id: 1, username: 'elias' }])) };
  const authMock = createAuthServiceMock({ hasAnyRole: vi.fn(() => true) });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutListPageComponent],
      providers: [
        provideRouter([]),
        { provide: WorkoutApiService, useValue: workoutApi },
        { provide: UserApiService, useValue: userApi },
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutListPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('loads workouts and filters by query', () => {
    fixture.detectChanges();

    expect(workoutApi.getAll).toHaveBeenCalled();
    expect(fixture.componentInstance.filteredWorkouts()).toHaveLength(2);

    fixture.componentInstance.setQuery('run');
    expect(fixture.componentInstance.filteredWorkouts()).toHaveLength(1);

    const workout = { id: 7 } as Workout;
    expect(fixture.componentInstance.trackByWorkout(0, workout)).toBe(7);
  });

  it('deletes a workout after confirmation', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    fixture.detectChanges();
    fixture.componentInstance.deleteWorkout({
      id: 2,
      title: 'Run',
      description: 'Cardio',
      workoutDate: '2026-06-11',
      userId: 1,
      exercises: []
    });

    expect(workoutApi.delete).toHaveBeenCalledWith(2);
    expect(workoutApi.getAll.mock.calls.length).toBeGreaterThanOrEqual(2);

    confirmSpy.mockRestore();
  });
});