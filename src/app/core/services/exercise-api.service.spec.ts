import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ExerciseApiService } from './exercise-api.service';
import { environment } from '../../../environments/environment';

describe('ExerciseApiService', () => {
  let service: ExerciseApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ExerciseApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads exercises', () => {
    service.getAll().subscribe((exercises) => {
      expect(exercises).toHaveLength(1);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/exercises`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Bench', repetitions: 10, durationInMinutes: 20, weight: 40, workoutId: 1 }]);
  });

  it('loads an exercise by id', () => {
    service.getById(7).subscribe((exercise) => {
      expect(exercise.id).toBe(7);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/exercises/7`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 7, name: 'Run', repetitions: null, durationInMinutes: 30, weight: null, workoutId: 2 });
  });

  it('updates and deletes exercises', () => {
    service.update(2, { name: 'Squat' }).subscribe((exercise) => {
      expect(exercise.id).toBe(2);
    });

    let req = httpMock.expectOne(`${environment.apiBaseUrl}/exercises/2`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 2, name: 'Squat', repetitions: 8, durationInMinutes: 20, weight: 60, workoutId: 1 });

    service.delete(3).subscribe();
    req = httpMock.expectOne(`${environment.apiBaseUrl}/exercises/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});