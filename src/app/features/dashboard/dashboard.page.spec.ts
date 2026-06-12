import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardPageComponent } from './dashboard.page';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { UserApiService } from '../../core/services/user-api.service';
import { AuthService } from '../../core/services/auth.service';
import { createAuthServiceMock } from '../../../testing/test-helpers';

describe('DashboardPageComponent', () => {
  let fixture: ComponentFixture<DashboardPageComponent>;
  const workoutApi = {
    getAll: vi.fn(() =>
      of([
        {
          id: 1,
          title: 'Push',
          description: null,
          workoutDate: '2026-06-10',
          userId: 1,
          exercises: [{ id: 1, name: 'Bench', repetitions: 10, durationInMinutes: 20, weight: 40 }]
        }
      ])
    )
  };
  const userApi = { getAll: vi.fn(() => of([{ id: 1, username: 'benutzer1' }])) };
  const authMock = createAuthServiceMock({ hasAnyRole: vi.fn(() => true) });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [
        provideRouter([]),
        { provide: WorkoutApiService, useValue: workoutApi },
        { provide: UserApiService, useValue: userApi },
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('loads statistics from the backend services', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.workoutCount()).toBe(1);
    expect(fixture.componentInstance.exerciseCount()).toBe(1);
    expect(fixture.componentInstance.userCount()).toBe(1);
  });

  it('reloads statistics when requested', () => {
    fixture.detectChanges();
    workoutApi.getAll.mockReturnValueOnce(of([]));
    userApi.getAll.mockReturnValueOnce(of([]));
    fixture.componentInstance.reload();
    expect(fixture.componentInstance.workoutCount()).toBe(0);
    expect(fixture.componentInstance.userCount()).toBe(0);
  });
});