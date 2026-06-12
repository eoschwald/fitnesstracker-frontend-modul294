import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { WorkoutFormPageComponent } from './workout-form.page';
import { WorkoutApiService } from '../../core/services/workout-api.service';
import { UserApiService } from '../../core/services/user-api.service';

const workoutApi = {
  getById: vi.fn(() =>
    of({
      id: 1,
      title: 'Push Day',
      description: 'Upper body',
      workoutDate: '2026-06-10',
      userId: 2,
      exercises: []
    })
  ),
  create: vi.fn(() =>
    of({ id: 2, title: 'Leg Day', description: null, workoutDate: '2026-06-11', userId: 1, exercises: [] })
  ),
  update: vi.fn(() =>
    of({ id: 1, title: 'Push Day', description: 'Updated', workoutDate: '2026-06-10', userId: 2, exercises: [] })
  )
};

const userApi = {
  getAll: vi.fn(() => of([{ id: 1, username: 'alice' }, { id: 2, username: 'bob' }]))
};

describe('WorkoutFormPageComponent', () => {
  describe('create mode', () => {
    let fixture: ComponentFixture<WorkoutFormPageComponent>;
    const routerMock = { navigate: vi.fn().mockResolvedValue(true) };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [WorkoutFormPageComponent],
        providers: [
          provideRouter([]),
          { provide: Router, useValue: routerMock },
          { provide: WorkoutApiService, useValue: workoutApi },
          { provide: UserApiService, useValue: userApi },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(WorkoutFormPageComponent);
    });

    it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('loads the form and creates a workout', () => {
      fixture.detectChanges();

      fixture.componentInstance.form.setValue({
        title: 'Leg Day',
        description: 'Heavy session',
        workoutDate: '2026-06-11',
        userId: '1'
      });

      fixture.componentInstance.save();

      expect(workoutApi.create).toHaveBeenCalledWith({
        title: 'Leg Day',
        description: 'Heavy session',
        workoutDate: '2026-06-11',
        userId: 1
      });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/workouts', 2]);
    });
  });

  describe('edit mode', () => {
    let fixture: ComponentFixture<WorkoutFormPageComponent>;
    const editRouterMock = { navigate: vi.fn().mockResolvedValue(true) };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [WorkoutFormPageComponent],
        providers: [
          provideRouter([]),
          { provide: Router, useValue: editRouterMock },
          { provide: WorkoutApiService, useValue: workoutApi },
          { provide: UserApiService, useValue: userApi },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(WorkoutFormPageComponent);
    });

    it('loads existing workout data in edit mode', () => {
      fixture.detectChanges();

      expect(fixture.componentInstance.isEditMode).toBe(true);
      expect(fixture.componentInstance.title.value).toBe('Push Day');
      expect(fixture.componentInstance.userId.value).toBe('2');
    });
  });
});