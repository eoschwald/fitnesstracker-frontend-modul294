import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShellComponent } from './shell.component';
import { AuthService } from '../../core/services/auth.service';
import { createAuthServiceMock } from '../../../testing/test-helpers';

describe('ShellComponent', () => {
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {
    const authMock = createAuthServiceMock({
      userName: vi.fn(() => 'benutzer1'),
      roles: vi.fn(() => ['READ', 'UPDATE']),
      isLoggedIn: vi.fn(() => true),
      ready: vi.fn(() => true)
    });

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the signed-in state with navigation', () => {
    fixture.componentInstance.loggedIn = true;
    fixture.componentInstance.userName = 'benutzer1';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Fitness Tracker');
    expect(fixture.nativeElement.textContent).toContain('benutzer1');
    expect(fixture.nativeElement.textContent).toContain('Abmelden');
  });

  it('shows the login button when logged out', () => {
    fixture.componentInstance.loggedIn = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Anmelden');
  });
});