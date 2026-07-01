import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  private allowedRoles: string[] = [];

  constructor() {
    effect(() => {
      const user = this.authService.user();
      this.updateView(user?.roles ?? []);
    });
  }

  @Input() set appHasRole(roles: string[]) {
    this.allowedRoles = roles;
    const user = this.authService.user();
    this.updateView(user?.roles ?? []);
  }

  private updateView(userRoles: string[]): void {
    this.viewContainer.clear();
    if (userRoles.some(r => this.allowedRoles.includes(r))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
