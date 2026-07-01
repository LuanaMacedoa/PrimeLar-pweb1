import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DatabaseService } from './database-service';

@Injectable({ providedIn: 'root' })
export class ImovelService {
  private readonly db = inject(DatabaseService);

  async getImoveis(): Promise<any[]> {
    try {
      const data = await lastValueFrom(
        this.db.http.get<any[]>(`${this.db.apiUrl}/imoveis`)
      );
      return data ?? [];
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      return [];
    }
  }
}
