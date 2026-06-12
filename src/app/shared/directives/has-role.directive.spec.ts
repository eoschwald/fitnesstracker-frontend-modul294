import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HasRoleDirective } from './has-role.directive';
import { AuthService } from '../../core/services/auth.service';
import { createAuthServiceMock } from '../../../testing/test-helpers';

@Component({
  standalone: true,
  imports: [HasRoleDirective],
  template: `<div *appHasRole="['READ']">Visible</div>`
})
class HostComponent {}

async function renderHost(hasRole: boolean): Promise<ComponentFixture<HostComponent>> {
  await TestBed.configureTestingModule({
    imports: [HostComponent],
    providers: [{ provide: AuthService, useValue: createAuthServiceMock({ hasAnyRole: vi.fn(() => hasRole) }) }]
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return fixture;
}

describe('HasRoleDirective', () => {
  it('renders the content when the role matches', async () => {
    const fixture = await renderHost(true);
    expect(fixture.nativeElement.textContent).toContain('Visible');
  });

  it('hides the content when the role does not match', async () => {
    const fixture = await renderHost(false);
    expect(fixture.nativeElement.textContent).not.toContain('Visible');
  });
});