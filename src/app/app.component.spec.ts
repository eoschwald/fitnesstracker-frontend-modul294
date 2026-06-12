import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { createAuthServiceMock } from '../testing/test-helpers';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  const authMock = createAuthServiceMock({
    userName: vi.fn(() => 'benutzer1'),
    roles: vi.fn(() => ['READ', 'UPDATE']),
    isLoggedIn: vi.fn(() => true)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the shell with the current user', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Fitness Tracker');
    expect(fixture.nativeElement.textContent).toContain('benutzer1');
  });
});