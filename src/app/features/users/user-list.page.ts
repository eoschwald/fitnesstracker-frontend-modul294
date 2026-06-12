import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserApiService } from '../../core/services/user-api.service';
import { User } from '../../core/models/user.model';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';

@Component({
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, HasRoleDirective],
  template: `
    <app-page-header title="Benutzer" subtitle="Benutzerverwaltung für den User- und Workout-Bezug.">
      <div actions class="row">
        <input
          class="input"
          style="min-width: 240px;"
          type="search"
          placeholder="Suche..."
          [value]="query()"
          (input)="setQuery(search.value)"
          #search
        />
        <a class="btn primary" routerLink="/users/new" *appHasRole="['UPDATE']">Benutzer anlegen</a>
      </div>
    </app-page-header>

    <div class="card card-pad stack">
      @if (filteredUsers().length > 0) {
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Aktionen</th>
            </tr>
          </thead>

          <tbody>
            @for (user of filteredUsers(); track user.id) {
              <tr>
                <td>#{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>
                  <div class="table-actions">
                    <a class="btn secondary" [routerLink]="['/users', user.id, 'edit']" *appHasRole="['UPDATE']">Bearbeiten</a>
                    <button class="btn danger" type="button" *appHasRole="['UPDATE']" (click)="deleteUser(user)">Löschen</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="empty">Keine Benutzer gefunden.</div>
      }
    </div>
  `
})
export class UserListPageComponent implements OnInit {
  private readonly api = inject(UserApiService);

  readonly users = signal<User[]>([]);
  readonly query = signal('');

  readonly filteredUsers = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q
      ? this.users().filter((user) => `${user.id} ${user.username}`.toLowerCase().includes(q))
      : this.users();
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.api.getAll().subscribe((users) => this.users.set(users));
  }

  setQuery(value: string): void {
    this.query.set(value);
  }

  deleteUser(user: User): void {
    if (!confirm(`Benutzer "${user.username}" wirklich löschen?`)) {
      return;
    }

    this.api.delete(user.id).subscribe(() => this.reload());
  }

  trackByUser(_: number, user: User): number {
    return user.id;
  }
}