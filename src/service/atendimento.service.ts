import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database-service';

@Injectable({
  providedIn: 'root',
})
export class AtendimentoService {

  private readonly db = inject(DatabaseService);

  async criarAtendimento(dados: any) {
    const { data, error } = await this.db.supabase.from('atendimento').insert([dados]).select().single();

    if (error) {
      console.error('Erro ao criar atendimento:', error);
      return null;
    }

    return data;
  }
}