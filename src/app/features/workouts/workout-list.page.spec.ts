import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { WorkoutListPageComponent } from './workout-list.page';
import { AuthService } from '../../core/services/auth.service';

describe('WorkoutListPageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WorkoutListPageComponent],
      providers: [{
        provide: AuthService,
        useValue: {
          hasAnyRole: () => true,
          hasRole: () => true,
          isLoggedIn: () => true,
          roles: () => [],
          userName: () => null,
          login: () => undefined,
          logout: () => undefined,
          accessToken: () => null
        }
      }]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(WorkoutListPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('tracks workouts by id and filters by query', () => {
    const fixture = TestBed.createComponent(WorkoutListPageComponent);
    const component = fixture.componentInstance;

    expect(component.trackByWorkout(0, { id: 7 } as any)).toBe(7);
    component.workouts.set([
      { id: 1, title: 'Push', description: 'Upper body', workoutDate: '2026-06-10', userId: 1, exercises: [] },
      { id: 2, title: 'Run', description: 'Cardio', workoutDate: '2026-06-11', userId: 1, exercises: [] }
    ]);
    component.users.set([{ id: 1, username: 'elias' }]);
    component.setQuery('run');
    expect(component.filteredWorkouts().length).toBe(1);
  });
});
