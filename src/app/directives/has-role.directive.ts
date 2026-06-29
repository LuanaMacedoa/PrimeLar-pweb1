//centralizei a lógica de permissoôes para ficar mais fácil

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
      this.updateView(user?.role);
    });
  }

  @Input() set appHasRole(roles: string[]) {
    this.allowedRoles = roles;
    const user = this.authService.user();
    this.updateView(user?.role);
  }

  private updateView(userRole?: string): void {
    this.viewContainer.clear();
    if (userRole && this.allowedRoles.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}