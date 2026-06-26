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


  }
}
