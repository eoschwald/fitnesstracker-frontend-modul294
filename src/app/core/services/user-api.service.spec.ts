import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserApiService } from './user-api.service';
import { environment } from '../../../environments/environment';

describe('UserApiService', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads users', () => {
    service.getAll().subscribe((users) => {
      expect(users).toHaveLength(1);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, username: 'benutzer1' }]);
  });

  it('loads a user by id', () => {
    service.getById(4).subscribe((user) => {
      expect(user.username).toBe('benutzer4');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/users/4`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 4, username: 'benutzer4' });
  });

  it('creates, updates and deletes users', () => {
    service.create({ username: 'new-user' }).subscribe((user) => {
      expect(user.username).toBe('new-user');
    });
    let req = httpMock.expectOne(`${environment.apiBaseUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'new-user' });
    req.flush({ id: 10, username: 'new-user' });

    service.update(10, { username: 'updated-user' }).subscribe((user) => {
      expect(user.username).toBe('updated-user');
    });
    req = httpMock.expectOne(`${environment.apiBaseUrl}/users/10`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ username: 'updated-user' });
    req.flush({ id: 10, username: 'updated-user' });

    service.delete(10).subscribe();
    req = httpMock.expectOne(`${environment.apiBaseUrl}/users/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});