import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DatabaseService } from './database-service';

const MOCK_IMOVEIS = [
  {
    id: 1,
    name: 'Residência Altiplano',
    category: 'Casa',
    type: 'Casa',
    info: 'Altiplano · 4 quartos · 280 m²',
    badge: 'R$ 980.000',
    image: 'assets/img/property-3.png',
    alt: 'Casa no Altiplano',
  },
  {
    id: 2,
    name: 'Apto Beira-Mar',
    category: 'Apartamento',
    type: 'Apartamento',
    info: 'Cabo Branco · 3 quartos · 120 m²',
    badge: 'R$ 750.000',
    image: 'assets/img/property-5.png',
    alt: 'Apartamento em Cabo Branco',
  },
  {
    id: 3,
    name: 'Village Bessa',
    category: 'Condomínio',
    type: 'Condomínio',
    info: 'Bessa · 3 quartos · 180 m²',
    badge: 'R$ 620.000',
    image: 'assets/img/property-6.png',
    alt: 'Condomínio no Bessa',
  },
  {
    id: 4,
    name: 'Cobertura Manaíra',
    category: 'Premium',
    type: 'Premium',
    info: 'Manaíra · 5 quartos · 320 m²',
    badge: 'R$ 1.800.000',
    image: 'assets/img/property-4.png',
    alt: 'Cobertura em Manaíra',
  },
  {
    id: 5,
    name: 'Flat Tambaú',
    category: 'Apartamento',
    type: 'Apartamento',
    info: 'Tambaú · 2 quartos · 75 m²',
    badge: 'R$ 490.000',
    image: 'assets/img/property-2.png',
    alt: 'Flat em Tambaú',
  },
  {
    id: 6,
    name: 'Casa Nobre',
    category: 'Casa',
    type: 'Casa',
    info: 'Altiplano · 3 quartos · 220 m²',
    badge: 'R$ 820.000',
    image: 'assets/img/property-1.png',
    alt: 'Casa no Altiplano',
  },
];

@Injectable({ providedIn: 'root' })
export class ImovelService {
  private readonly db = inject(DatabaseService);

  async getImoveis(): Promise<any[]> {
    try {
      const data = await lastValueFrom(
        this.db.http.get<any[]>(`${this.db.apiUrl}/imoveis`)
      );
      return data?.length ? data : MOCK_IMOVEIS;
    } catch {
      return MOCK_IMOVEIS;
    }
  }
}
