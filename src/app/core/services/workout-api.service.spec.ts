import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WorkoutApiService } from './workout-api.service';
import { environment } from '../../../environments/environment';

describe('WorkoutApiService', () => {
  let service: WorkoutApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(WorkoutApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads workouts', () => {
    service.getAll().subscribe((workouts) => {
      expect(workouts).toHaveLength(1);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/workouts`);
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        id: 1,
        title: 'Push Day',
        description: 'Upper body',
        workoutDate: '2026-06-10',
        userId: 1,
        exercises: []
      }
    ]);
  });

  it('loads a workout by id', () => {
    service.getById(7).subscribe((workout) => {
      expect(workout.id).toBe(7);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/workouts/7`);
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 7,
      title: 'Run',
      description: null,
      workoutDate: '2026-06-11',
      userId: 1,
      exercises: []
    });
  });

  it('creates, updates and deletes workouts', () => {
    service.create({
      title: 'Leg Day',
      description: 'Heavy session',
      workoutDate: '2026-06-11',
      userId: 1
    }).subscribe((workout) => {
      expect(workout.id).toBe(2);
    });

    let req = httpMock.expectOne(`${environment.apiBaseUrl}/workouts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      title: 'Leg Day',
      description: 'Heavy session',
      workoutDate: '2026-06-11',
      userId: 1
    });
    req.flush({
      id: 2,
      title: 'Leg Day',
      description: 'Heavy session',
      workoutDate: '2026-06-11',
      userId: 1,
      exercises: []
    });

    service.update(2, {
      title: 'Leg Day',
      description: 'Updated',
      workoutDate: '2026-06-11',
      userId: 1
    }).subscribe((workout) => {
      expect(workout.title).toBe('Leg Day');
    });

    req = httpMock.expectOne(`${environment.apiBaseUrl}/workouts/2`);
    expect(req.request.method).toBe('PUT');
    req.flush({
      id: 2,
      title: 'Leg Day',
      description: 'Updated',
      workoutDate: '2026-06-11',
      userId: 1,
      exercises: []
    });

    service.delete(2).subscribe();
    req = httpMock.expectOne(`${environment.apiBaseUrl}/workouts/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('manages exercises inside a workout', () => {
    service.getExercises(3).subscribe((exercises) => {
      expect(exercises).toHaveLength(1);
    });
    let req = httpMock.expectOne(`${environment.apiBaseUrl}/workouts/3/exercises`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Bench', repetitions: 10, durationInMinutes: 20, weight: 40 }]);

    service.addExercise(3, {
      name: 'Bench',
      repetitions: 10,
      durationInMinutes: 20,
      weight: 40
    }).subscribe((exercise) => {
      expect(exercise.name).toBe('Bench');
    });
    req = httpMock.expectOne(`${environment.apiBaseUrl}/workouts/3/exercises`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 2, name: 'Bench', repetitions: 10, durationInMinutes: 20, weight: 40 });

    service.removeExercise(3, 2).subscribe();
    req = httpMock.expectOne(`${environment.apiBaseUrl}/workouts/3/exercises/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});