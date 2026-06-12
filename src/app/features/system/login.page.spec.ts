import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginPageComponent } from './login.page';
import { AuthService } from '../../core/services/auth.service';
import { createAuthServiceMock } from '../../../testing/test-helpers';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  const authMock = createAuthServiceMock({
    login: vi.fn(),
    ready: vi.fn(() => true)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('starts the login flow when the button is clicked', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(authMock.login).toHaveBeenCalled();
  });
});