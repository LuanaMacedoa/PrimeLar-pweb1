import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export type ImovelTipo = 'Casa' | 'Apartamento' | 'Condomínio' | 'Premium';

export interface ImovelApiResponse {
  id: number;
  titulo: string;
  descricao?: string | null;
  preco: number;
  cidade: string;
  bairro: string;
  endereco?: string | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  caminhoImagem?: string | null;
}

export interface ImovelRequestPayload {
  titulo: string;
  descricao?: string;
  preco: number;
  cidade: string;
  bairro: string;
  endereco?: string;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  caminhoImagem?: string;
}

export interface LandingImovelCard {
  id: number;
  name: string;
  type: ImovelTipo;
  location: string;
  price: string;
  image: string;
  alt: string;
  category: string;
  info: string;
  badge: string;
}

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
  private readonly api = environment.apiUrl;
  private readonly http = inject(HttpClient);

  async listar(): Promise<ImovelApiResponse[]> {
    try {
      const data = await lastValueFrom(this.http.get<ImovelApiResponse[]>(`${this.api}/imoveis`));
      return data ?? [];
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      return [];
    }
  }

  async buscarPorId(id: number): Promise<ImovelApiResponse | null> {
    try {
      return await lastValueFrom(this.http.get<ImovelApiResponse>(`${this.api}/imoveis/${id}`));
    } catch (error) {
      console.error(`Erro ao buscar imóvel ${id}:`, error);
      return null;
    }
  }

  async criar(payload: ImovelRequestPayload): Promise<ImovelApiResponse | null> {
    try {
      return await lastValueFrom(this.http.post<ImovelApiResponse>(`${this.api}/imoveis`, payload));
    } catch (error) {
      console.error('Erro ao cadastrar imóvel:', error);
      return null;
    }
  }

  async criarComImagem(payload: ImovelRequestPayload, imagem: File | null): Promise<ImovelApiResponse | null> {
    try {
      const formData = this.toFormData(payload, imagem);
      return await lastValueFrom(
        this.http.post<ImovelApiResponse>(`${this.api}/imoveis`, formData)
      );
    } catch (error) {
      console.error('Erro ao cadastrar imóvel com imagem:', error);
      return null;
    }
  }

  async atualizar(id: number, payload: ImovelRequestPayload): Promise<ImovelApiResponse | null> {
    try {
      return await lastValueFrom(this.http.put<ImovelApiResponse>(`${this.api}/imoveis/${id}`, payload));
    } catch (error) {
      console.error(`Erro ao atualizar imóvel ${id}:`, error);
      return null;
    }
  }

  async atualizarComImagem(id: number, payload: ImovelRequestPayload, imagem: File | null): Promise<ImovelApiResponse | null> {
    try {
      const formData = this.toFormData(payload, imagem);
      return await lastValueFrom(
        this.http.put<ImovelApiResponse>(`${this.api}/imoveis/${id}`, formData)
      );
    } catch (error) {
      console.error(`Erro ao atualizar imóvel ${id} com imagem:`, error);
      return null;
    }
  }

  async excluir(id: number): Promise<boolean> {
    try {
      await lastValueFrom(this.http.delete(`${this.api}/imoveis/${id}`));
      return true;
    } catch (error) {
      console.error(`Erro ao excluir imóvel ${id}:`, error);
      return false;
    }
  }

  async getImoveis(): Promise<LandingImovelCard[]> {
    const imoveis = await this.listar();
    return imoveis.map((imovel, index) => this.toLandingCard(imovel, index));
  }

  resolveImageUrl(caminhoImagem?: string | null): string {
    if (!caminhoImagem) {
      return 'assets/img/property-3.png';
    }

    const normalizedPath = caminhoImagem.trim();

    if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) {
      return normalizedPath;
    }

    if (normalizedPath.startsWith('/uploads/')) {
      return `${this.api}${normalizedPath}`;
    }

    if (normalizedPath.startsWith('uploads/')) {
      return `${this.api}/${normalizedPath}`;
    }

    if (normalizedPath.startsWith('assets/')) {
      return normalizedPath;
    }

    if (normalizedPath.startsWith('/assets/')) {
      return normalizedPath.slice(1);
    }

    return 'assets/img/property-3.png';
  }

  private toLandingCard(imovel: ImovelApiResponse, index: number): LandingImovelCard {
    const type = this.deriveType(imovel.titulo, imovel.preco);
    const image = imovel.caminhoImagem?.trim()
      ? this.resolveImageUrl(imovel.caminhoImagem)
      : this.pickImage(index, type);
    const price = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(Number(imovel.preco ?? 0));

    return {
      id: imovel.id,
      name: imovel.titulo,
      type,
      location: `${imovel.cidade} • ${imovel.bairro}`,
      price,
      image,
      alt: imovel.titulo,
      category: imovel.cidade,
      info: [imovel.bairro, imovel.endereco, this.buildRoomsInfo(imovel)].filter(Boolean).join(' • '),
      badge: this.buildBadge(imovel, type),
    };
  }

  private deriveType(titulo: string, preco: number): ImovelTipo {
    const normalized = titulo.toLowerCase();

    if (normalized.includes('apart')) return 'Apartamento';
    if (normalized.includes('cond')) return 'Condomínio';
    if (normalized.includes('premium') || preco >= 1000000) return 'Premium';
    return 'Casa';
  }

  private pickImage(index: number, type: ImovelTipo): string {
    const gallery = {
      Casa: ['assets/img/property-3.png', 'assets/img/property-2.png'],
      Apartamento: ['assets/img/property-5.png', 'assets/img/property-4.png'],
      Condomínio: ['assets/img/property-6.png', 'assets/img/property-3.png'],
      Premium: ['assets/img/property-4.png', 'assets/img/property-5.png'],
    } satisfies Record<ImovelTipo, string[]>;

    const choices = gallery[type];
    return choices[index % choices.length];
  }

  private buildRoomsInfo(imovel: ImovelApiResponse): string {
    const parts = [
      imovel.quartos ? `${imovel.quartos} quarto(s)` : '',
      imovel.banheiros ? `${imovel.banheiros} banheiro(s)` : '',
      imovel.vagas ? `${imovel.vagas} vaga(s)` : '',
    ].filter(Boolean);

    return parts.join(' • ');
  }

  private buildBadge(imovel: ImovelApiResponse, type: ImovelTipo): string {
    if (imovel.caminhoImagem?.trim()) return 'Publicado';
    if (type === 'Premium') return 'Alto padrão';
    if (imovel.quartos && imovel.quartos >= 4) return 'Amplo';
    return 'Destaque';
  }

  private toFormData(payload: ImovelRequestPayload, imagem: File | null): FormData {
    const formData = new FormData();
    formData.append('titulo', payload.titulo);
    if (payload.descricao) formData.append('descricao', payload.descricao);
    formData.append('preco', String(payload.preco));
    formData.append('cidade', payload.cidade);
    formData.append('bairro', payload.bairro);
    if (payload.endereco) formData.append('endereco', payload.endereco);
    if (payload.quartos !== null && payload.quartos !== undefined) {
      formData.append('quartos', String(payload.quartos));
    }
    if (payload.banheiros !== null && payload.banheiros !== undefined) {
      formData.append('banheiros', String(payload.banheiros));
    }
    if (payload.vagas !== null && payload.vagas !== undefined) {
      formData.append('vagas', String(payload.vagas));
    }
    if (payload.caminhoImagem) formData.append('caminhoImagem', payload.caminhoImagem);

    if (imagem) {
      formData.append('imagem', imagem);
    }

    return formData;
  }
}
