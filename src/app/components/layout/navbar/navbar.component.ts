import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';

type NavbarVariant = 'landing' | 'auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown.escape)': 'closeMobileMenu()',
  },
})
export class NavbarComponent {
  @Input() variant: NavbarVariant = 'landing';
  @Input() activeHref: string | null = null;

  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);

  protected readonly landingNavLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Imóveis', href: '#imoveis' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Contato', href: '#contato' },
  ];

  protected showMobileMenu = false;
  protected showUserMenu = signal(false);

  protected toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  protected closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  protected toggleUserMenu(): void {
    this.showUserMenu.update((value) => !value);
  }

  protected closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showUserMenu()) return;

    const target = event.target as Node | null;
    if (target && !this.hostElement.nativeElement.contains(target)) {
      this.closeUserMenu();
    }
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
    this.closeUserMenu();
  }

  protected get dashboardRoute(): string {
    const roles = this.user()?.roles ?? [];
    if (roles.includes('ADMIN')) return '/admin';
    if (roles.includes('CORRETOR')) return '/corretor';
    return '/cliente';
  }

  protected get dashboardLabel(): string {
    const roles = this.user()?.roles ?? [];
    if (roles.includes('ADMIN')) return 'Painel administrativo';
    if (roles.includes('CORRETOR')) return 'Área do corretor';
    return 'Minha área';
  }

  protected async deactivateAccount(): Promise<void> {
    const confirmed = window.confirm('Tem certeza que deseja desativar sua conta?');
    if (!confirmed) return;

    await this.auth.deactivateAccount();
    await this.router.navigateByUrl('/auth');
    window.location.reload();
    this.closeUserMenu();
  }

  auth = inject(AuthService);
  user = this.auth.user;

  
}