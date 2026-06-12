import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserFormPageComponent } from './user-form.page';
import { UserApiService } from '../../core/services/user-api.service';

const api = {
  getById: vi.fn(() => of({ id: 1, username: 'alice' })),
  create: vi.fn(() => of({ id: 2, username: 'new-user' })),
  update: vi.fn(() => of({ id: 1, username: 'alice-updated' }))
};

describe('UserFormPageComponent', () => {
  describe('create mode', () => {
    let fixture: ComponentFixture<UserFormPageComponent>;
    const routerMock = { navigate: vi.fn().mockResolvedValue(true) };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UserFormPageComponent],
        providers: [
          provideRouter([]),
          { provide: Router, useValue: routerMock },
          { provide: UserApiService, useValue: api },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(UserFormPageComponent);
    });

    it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('creates a new user', () => {
      fixture.detectChanges();
      fixture.componentInstance.form.setValue({ username: 'new-user' });
      fixture.componentInstance.save();

      expect(api.create).toHaveBeenCalledWith({ username: 'new-user' });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
    });
  });

  describe('edit mode', () => {
    let fixture: ComponentFixture<UserFormPageComponent>;
    const editRouterMock = { navigate: vi.fn().mockResolvedValue(true) };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UserFormPageComponent],
        providers: [
          provideRouter([]),
          { provide: Router, useValue: editRouterMock },
          { provide: UserApiService, useValue: api },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(UserFormPageComponent);
    });

    it('loads an existing user and updates it', () => {
      fixture.detectChanges();
      expect(fixture.componentInstance.isEditMode).toBe(true);
      expect(fixture.componentInstance.username.value).toBe('alice');

      fixture.componentInstance.form.setValue({ username: 'alice-updated' });
      fixture.componentInstance.save();
      expect(api.update).toHaveBeenCalledWith(1, { username: 'alice-updated' });
    });
  });
});