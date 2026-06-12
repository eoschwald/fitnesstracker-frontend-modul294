import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UserListPageComponent } from './user-list.page';
import { UserApiService } from '../../core/services/user-api.service';
import { AuthService } from '../../core/services/auth.service';
import { createAuthServiceMock } from '../../../testing/test-helpers';

describe('UserListPageComponent', () => {
  let fixture: ComponentFixture<UserListPageComponent>;
  const api = {
    getAll: vi.fn(() =>
      of([
        { id: 1, username: 'alice' },
        { id: 2, username: 'bob' }
      ])
    ),
    delete: vi.fn(() => of(void 0))
  };
  const authMock = createAuthServiceMock({ hasAnyRole: vi.fn(() => true) });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListPageComponent],
      providers: [
        provideRouter([]),
        { provide: UserApiService, useValue: api },
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('loads and filters users', () => {
    fixture.detectChanges();
    expect(api.getAll).toHaveBeenCalled();
    expect(fixture.componentInstance.filteredUsers().length).toBe(2);

    fixture.componentInstance.setQuery('bob');
    expect(fixture.componentInstance.filteredUsers()).toHaveLength(1);
  });

  it('deletes a user after confirmation', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.detectChanges();

    fixture.componentInstance.deleteUser({ id: 2, username: 'bob' });

    expect(api.delete).toHaveBeenCalledWith(2);
    expect(api.getAll.mock.calls.length).toBeGreaterThanOrEqual(2);
    confirmSpy.mockRestore();
  });
});