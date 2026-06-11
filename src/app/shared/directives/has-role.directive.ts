import { Directive, EmbeddedViewRef, Input, OnChanges, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnChanges {
  private readonly auth = inject(AuthService);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private renderedView?: EmbeddedViewRef<unknown>;

  @Input('appHasRole') roles: string | string[] = [];

  ngOnChanges(): void {
    this.viewContainer.clear();

    const requiredRoles = Array.isArray(this.roles) ? this.roles : [this.roles];
    if (this.auth.hasAnyRole(requiredRoles)) {
      this.renderedView = this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
