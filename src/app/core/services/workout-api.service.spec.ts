import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WorkoutApiService } from './workout-api.service';

describe('WorkoutApiService', () => {
  let service: WorkoutApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(WorkoutApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads workouts', () => {
    service.getAll().subscribe();
    const req = httpMock.expectOne('http://localhost:8081/api/workouts');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('creates a workout', () => {
    service.create({ title: 'A', description: null, workoutDate: '2026-06-10', userId: 1 }).subscribe();
    const req = httpMock.expectOne('http://localhost:8081/api/workouts');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1 });
  });

  it('updates and deletes workouts', () => {
    service.update(2, { title: 'B', description: null, workoutDate: '2026-06-10', userId: 1 }).subscribe();
    httpMock.expectOne('http://localhost:8081/api/workouts/2').flush({ id: 2 });

    service.delete(3).subscribe();
    httpMock.expectOne('http://localhost:8081/api/workouts/3').flush(null);
  });

  it('manages exercises inside a workout', () => {
    service.getExercises(9).subscribe();
    httpMock.expectOne('http://localhost:8081/api/workouts/9/exercises').flush([]);

    service.addExercise(9, { name: 'Bench', repetitions: 10, durationInMinutes: null, weight: 40 }).subscribe();
    httpMock.expectOne('http://localhost:8081/api/workouts/9/exercises').flush({ id: 1 });

    service.removeExercise(9, 1).subscribe();
    httpMock.expectOne('http://localhost:8081/api/workouts/9/exercises/1').flush(null);
  });
});
