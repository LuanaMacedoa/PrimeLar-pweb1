import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  async criarAtendimento(dados: any): Promise<any> {
    // sem endpoint de atendimento no backend ainda
    console.log('Solicitação de atendimento recebida:', dados);
    return { id: Date.now() };
  }
}
