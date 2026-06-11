import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { DashboardPageComponent } from './features/dashboard/dashboard.page';
import { ForbiddenPageComponent } from './features/system/forbidden.page';
import { LoginPageComponent } from './features/system/login.page';
import { NotFoundPageComponent } from './features/system/not-found.page';
import { WorkoutDetailPageComponent } from './features/workouts/workout-detail.page';
import { WorkoutFormPageComponent } from './features/workouts/workout-form.page';
import { WorkoutListPageComponent } from './features/workouts/workout-list.page';
import { UserFormPageComponent } from './features/users/user-form.page';
import { UserListPageComponent } from './features/users/user-list.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginPageComponent },
  { path: 'forbidden', component: ForbiddenPageComponent },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['READ'] }
  },
  {
    path: 'workouts',
    component: WorkoutListPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['READ'] }
  },
  {
    path: 'workouts/new',
    component: WorkoutFormPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['UPDATE'] }
  },
  {
    path: 'workouts/:id',
    component: WorkoutDetailPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['READ'] }
  },
  {
    path: 'workouts/:id/edit',
    component: WorkoutFormPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['UPDATE'] }
  },
  {
    path: 'users',
    component: UserListPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['READ'] }
  },
  {
    path: 'users/new',
    component: UserFormPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['UPDATE'] }
  },
  {
    path: 'users/:id/edit',
    component: UserFormPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['UPDATE'] }
  },
  { path: '**', component: NotFoundPageComponent }
];