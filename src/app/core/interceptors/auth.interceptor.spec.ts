import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  it('adds the bearer token to outgoing requests', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { accessToken: () => 'token-123' } }
      ]
    });

    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    http.get('/api/workouts').subscribe();

    const req = httpMock.expectOne('/api/workouts');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush([]);
    httpMock.verify();
  });

  it('leaves asset requests untouched', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { accessToken: () => 'token-123' } }
      ]
    });

    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    http.get('assets/logo.png').subscribe();

    const req = httpMock.expectOne('assets/logo.png');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush('ok');
    httpMock.verify();
  });
});