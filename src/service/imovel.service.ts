import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './database-service';

@Injectable({
  providedIn: 'root',
})
export class ImovelService {

  private readonly db = inject(DatabaseService);

  async getImoveis(){

    const { data, error } = await this.db.supabase
      .from('imoveis')
      .select('*');

    
    if (error) {
      console.error('Erro ao buscar imóveis:', error);
      return [];
    }

    return data ?? [];


       /*return [ =========   MOCK =========
        {
          id: 1,
          name: 'Residência Prime',
          category: 'Casa familiar',
          type: 'Casa',
          info: '3 quartos · 2 vagas',
          badge: 'Destaque',
          image: 'assets/img/property-1.png',
          alt: 'Casa de alto padrão com três quartos',
        },
        {
          id: 2,
          name: 'Vista Central',
          category: 'Apartamento',
          type: 'Apartamento',
          info: '2 quartos · 1 vaga',
          badge: 'Novo',
          image: 'assets/img/property-2.png',
          alt: 'Apartamento moderno com dois quartos',
        },
    {
      id: 3,
      name: 'Mansão Jardins',
      category: 'Alto padrão',
      type: 'Premium',
      info: '4 quartos · 3 vagas',
      badge: 'Premium',
      image: 'assets/img/property-3.png',
      alt: 'Imóvel premium com quatro quartos',
    },
    {
      id: 4,
      name: 'Casa Horizonte',
      category: 'Espaço completo',
      type: 'Casa',
      info: '5 quartos · 4 vagas',
      badge: 'Família',
      image: 'assets/img/property-4.png',
      alt: 'Casa espaçosa com cinco quartos',
    },
    {
      id: 5,
      name: 'Varanda Bella',
      category: 'Condomínio',
      type: 'Condomínio',
      info: '3 quartos · 2 vagas',
      badge: 'Lazer',
      image: 'assets/img/property-5.png',
      alt: 'Apartamento sofisticado em condomínio',
       },
      ];
    }; */


    
  }
}
