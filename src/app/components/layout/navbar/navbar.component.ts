import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  protected readonly landingNavLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Imóveis', href: '#imoveis' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Contato', href: '#contato' },
  ];

  protected showMobileMenu = false;

  protected toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  protected closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  auth = inject(AuthService);
  user = this.auth.user;

  
}