import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExerciseApiService } from './exercise-api.service';

vi.mock('../../../environments/environment', () => ({
  environment: {
    apiBaseUrl: 'http://localhost:8081/api',
    auth: {
      issuer: 'http://localhost:8080/realms/fitness-tracker',
      clientId: 'fitness-tracker-client',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200',
      scope: 'openid profile email'
    }
  }
}));

describe('ExerciseApiService', () => {
  let service: ExerciseApiService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8081/api/exercises';

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

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Bench', repetitions: 10, durationInMinutes: 20, weight: 40, workoutId: 1 }]);
  });

  it('loads an exercise by id', () => {
    service.getById(7).subscribe((exercise) => {
      expect(exercise.id).toBe(7);
    });

    const req = httpMock.expectOne(`${baseUrl}/7`);
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 7,
      name: 'Run',
      repetitions: null,
      durationInMinutes: 30,
      weight: null,
      workoutId: 2
    });
  });

  it('updates and deletes exercises', () => {
    service.update(2, { name: 'Squat' }).subscribe((exercise) => {
      expect(exercise.id).toBe(2);
    });

    let req = httpMock.expectOne(`${baseUrl}/2`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 2, name: 'Squat', repetitions: 8, durationInMinutes: 20, weight: 60, workoutId: 1 });

    service.delete(3).subscribe();

    req = httpMock.expectOne(`${baseUrl}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});