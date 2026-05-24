import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  protected readonly footerColumns = [
    {
      title: 'Navegação',
      links: [
        { label: 'Início', href: '#inicio' },
        { label: 'Imóveis', href: '#imoveis' },
        { label: 'Serviços', href: '#servicos' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre nós', href: '#sobre' },
        { label: 'Depoimentos', href: '#depoimentos' },
        { label: 'Contato', href: '#contato' },
      ],
    },
    {
      title: 'Atendimento',
      links: [
        { label: 'Comprar', href: '#contato' },
        { label: 'Alugar', href: '#contato' },
        { label: 'Vender', href: '#contato' },
      ],
    },
  ];
}