import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShellComponent } from './shell.component';
import { AuthService } from '../../core/services/auth.service';
import { createAuthServiceMock } from '../../../testing/test-helpers';

describe('ShellComponent', () => {
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: createAuthServiceMock({
            hasAnyRole: vi.fn(() => true),
            hasRole: vi.fn(() => true),
            isLoggedIn: vi.fn(() => true),
            userName: vi.fn(() => 'benutzer1'),
            ready: vi.fn(() => true)
          })
        }
      ]
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
    expect(fixture.nativeElement.textContent).toContain('Dashboard');
    expect(fixture.nativeElement.textContent).toContain('Workouts');
    expect(fixture.nativeElement.textContent).toContain('Benutzer');
  });

  it('shows only the brand when logged out', () => {
    fixture.componentInstance.loggedIn = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Fitness Tracker');
    expect(fixture.nativeElement.textContent).not.toContain('Abmelden');
    expect(fixture.nativeElement.textContent).not.toContain('Dashboard');
    expect(fixture.nativeElement.textContent).not.toContain('Workouts');
    expect(fixture.nativeElement.textContent).not.toContain('Benutzer');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});