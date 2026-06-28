import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/layout/footer/footer.component';

type PropertyType = 'Casa' | 'Apartamento' | 'Condomínio' | 'Premium';
type ClientSection = 'perfil' | 'atividade' | 'consulta';

interface ClientProperty {
  id: number;
  name: string;
  type: PropertyType;
  location: string;
  price: string;
  image: string;
  alt: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  badge: string;
}

interface Proposal {
  property: string;
  value: string;
  status: 'Em análise' | 'Aprovada' | 'Recusada';
  date: string;
}

interface Visit {
  property: string;
  date: string;
  hour: string;
  status: 'Marcada' | 'Realizada' | 'Cancelada';
}

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './cliente.html',
  styleUrls: ['../../app.css'],
})
export class ClienteComponent {
  activeSection: ClientSection = 'perfil';

  propertyFilters = ['Todos', 'Casa', 'Apartamento', 'Condomínio', 'Premium'];
  activeFilter = 'Todos';
  searchTerm = '';

  profile = {
    nome: 'Gustavo Almeida',
    email: 'gustavo@email.com',
    telefone: '(83) 99999-9999',
    cidade: 'João Pessoa - PB',
    interesse: 'Comprar imóvel',
  };

  password = {
    atual: '',
    nova: '',
    confirmar: '',
  };

  profileSuccess = false;
  passwordSuccess = false;
  passwordError = '';
  actionMessage = '';

  favoriteIds = new Set<number>([1, 2]);

  properties: ClientProperty[] = [
    {
      id: 1,
      name: 'Casa moderna no Altiplano',
      type: 'Casa',
      location: 'Altiplano, João Pessoa',
      price: 'R$ 850.000',
      image: 'assets/img/property-3.png',
      alt: 'Casa moderna no Altiplano',
      bedrooms: 4,
      bathrooms: 3,
      area: '240m²',
      badge: 'Destaque',
      description:
        'Casa ampla, moderna e bem localizada, ideal para famílias que buscam conforto, privacidade e praticidade.',
    },
    {
      id: 2,
      name: 'Apartamento em Cabo Branco',
      type: 'Apartamento',
      location: 'Cabo Branco, João Pessoa',
      price: 'R$ 620.000',
      image: 'assets/img/property-5.png',
      alt: 'Apartamento em Cabo Branco',
      bedrooms: 3,
      bathrooms: 2,
      area: '96m²',
      badge: 'Vista mar',
      description:
        'Apartamento próximo à orla, com excelente ventilação, área de lazer e localização privilegiada.',
    },
    {
      id: 3,
      name: 'Condomínio familiar no Bessa',
      type: 'Condomínio',
      location: 'Bessa, João Pessoa',
      price: 'R$ 740.000',
      image: 'assets/img/property-6.png',
      alt: 'Condomínio familiar no Bessa',
      bedrooms: 3,
      bathrooms: 3,
      area: '180m²',
      badge: 'Seguro',
      description:
        'Imóvel em condomínio fechado, com segurança, conforto e estrutura completa para a família.',
    },
    {
      id: 4,
      name: 'Imóvel premium em Manaíra',
      type: 'Premium',
      location: 'Manaíra, João Pessoa',
      price: 'R$ 1.250.000',
      image: 'assets/img/property-4.png',
      alt: 'Imóvel premium em Manaíra',
      bedrooms: 4,
      bathrooms: 4,
      area: '310m²',
      badge: 'Premium',
      description:
        'Imóvel de alto padrão com acabamento sofisticado, ótima localização e ambientes integrados.',
    },
  ];

  proposals: Proposal[] = [
    {
      property: 'Casa moderna no Altiplano',
      value: 'R$ 810.000',
      status: 'Em análise',
      date: '12/06/2026',
    },
    {
      property: 'Apartamento em Cabo Branco',
      value: 'R$ 600.000',
      status: 'Aprovada',
      date: '08/06/2026',
    },
  ];

  visits: Visit[] = [
    {
      property: 'Condomínio familiar no Bessa',
      date: '18/06/2026',
      hour: '15:30',
      status: 'Marcada',
    },
    {
      property: 'Casa moderna no Altiplano',
      date: '10/06/2026',
      hour: '09:00',
      status: 'Realizada',
    },
  ];

  get favoriteProperties(): ClientProperty[] {
    return this.properties.filter((property) => this.favoriteIds.has(property.id));
  }

  get filteredProperties(): ClientProperty[] {
    return this.properties.filter((property) => {
      const matchesFilter = this.activeFilter === 'Todos' || property.type === this.activeFilter;

      const term = this.searchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        property.name.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term) ||
        property.type.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }

  setSection(section: ClientSection): void {
    this.activeSection = section;
  }

  updateProfile(): void {
    this.profileSuccess = true;

    setTimeout(() => {
      this.profileSuccess = false;
    }, 3000);
  }

  updatePassword(): void {
    this.passwordError = '';

    if (!this.password.atual || !this.password.nova || !this.password.confirmar) {
      this.passwordError = 'Preencha todos os campos de senha.';
      return;
    }

    if (this.password.nova.length < 6) {
      this.passwordError = 'A nova senha precisa ter pelo menos 6 caracteres.';
      return;
    }

    if (this.password.nova !== this.password.confirmar) {
      this.passwordError = 'A confirmação precisa ser igual à nova senha.';
      return;
    }

    this.password = {
      atual: '',
      nova: '',
      confirmar: '',
    };

    this.passwordSuccess = true;

    setTimeout(() => {
      this.passwordSuccess = false;
    }, 3000);
  }

  isFavorite(propertyId: number): boolean {
    return this.favoriteIds.has(propertyId);
  }

  toggleFavorite(property: ClientProperty): void {
    if (this.favoriteIds.has(property.id)) {
      this.favoriteIds.delete(property.id);
      this.showActionMessage('Imóvel removido dos favoritos.');
      return;
    }

    this.favoriteIds.add(property.id);
    this.showActionMessage('Imóvel adicionado aos favoritos.');
  }

  isVisitScheduled(property: ClientProperty): boolean {
    return this.visits.some(
      (visit) => visit.property === property.name && visit.status === 'Marcada',
    );
  }

  toggleVisit(property: ClientProperty): void {
    if (this.isVisitScheduled(property)) {
      this.cancelVisit(property);
      return;
    }

    this.scheduleVisit(property);
  }

  scheduleVisit(property: ClientProperty): void {
    this.visits.unshift({
      property: property.name,
      date: 'A combinar',
      hour: 'A combinar',
      status: 'Marcada',
    });

    this.showActionMessage('Visita solicitada com sucesso. A equipe entrará em contato.');
  }

  cancelVisit(property: ClientProperty): void {
    this.cancelVisitByPropertyName(property.name);
  }

  cancelVisitByPropertyName(propertyName: string): void {
    this.visits = this.visits.filter(
      (visit) => !(visit.property === propertyName && visit.status === 'Marcada'),
    );

    this.showActionMessage('Visita desmarcada com sucesso.');
  }

  clearFilters(): void {
    this.activeFilter = 'Todos';
    this.searchTerm = '';
  }

  private showActionMessage(message: string): void {
    this.actionMessage = message;

    setTimeout(() => {
      this.actionMessage = '';
    }, 3500);
  }
}
