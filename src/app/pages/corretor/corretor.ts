import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/layout/footer/footer.component';

type BrokerSection = 'visao' | 'perfil' | 'atendimentos' | 'funil';
type LeadStatus = 'Pendente' | 'Em atendimento' | 'Convertido';
type VisitStatus = 'Marcada' | 'Realizada' | 'Cancelada';
type ProposalStage = 'Lead' | 'Contato' | 'Visita' | 'Proposta' | 'Fechamento';

interface BrokerLead {
  id: number;
  client: string;
  phone: string;
  interest: string;
  propertyFocus: string;
  source: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: LeadStatus;
  date: string;
}

interface BrokerVisit {
  id: number;
  client: string;
  property: string;
  date: string;
  hour: string;
  status: VisitStatus;
}

interface BrokerProposal {
  id: number;
  client: string;
  property: string;
  value: string;
  stage: ProposalStage;
  lastUpdate: string;
}

@Component({
  selector: 'app-corretor',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './corretor.html',
  styleUrls: ['../../app.css'],
})
export class CorretorComponent {
  activeSection: BrokerSection = 'visao';

  actionMessage = '';

  leadFilters = ['Todos', 'Pendente', 'Em atendimento', 'Convertido'];
  activeLeadFilter = 'Todos';
  atendimentoSearchTerm = '';

  proposalStages: ProposalStage[] = ['Lead', 'Contato', 'Visita', 'Proposta', 'Fechamento'];

  profile = {
    nome: 'Carlos Henrique',
    email: 'corretor@primelar.com',
    telefone: '(83) 98888-7777',
    creci: 'CRECI-PB 12345',
    especialidade: 'Imóveis residenciais',
  };

  password = {
    atual: '',
    nova: '',
    confirmar: '',
  };

  profileSuccess = false;
  passwordSuccess = false;
  passwordError = '';

  leads: BrokerLead[] = [
    {
      id: 1,
      client: 'Mariana Souza',
      phone: '(83) 99991-2200',
      interest: 'Comprar apartamento',
      propertyFocus: 'Apartamento em Cabo Branco',
      source: 'Landing page',
      priority: 'Alta',
      status: 'Pendente',
      date: 'Hoje',
    },
    {
      id: 2,
      client: 'Lucas Ferreira',
      phone: '(83) 98820-1010',
      interest: 'Alugar casa',
      propertyFocus: 'Casa no Bessa',
      source: 'WhatsApp',
      priority: 'Média',
      status: 'Em atendimento',
      date: 'Hoje',
    },
    {
      id: 3,
      client: 'Rafaela Lima',
      phone: '(83) 98777-5511',
      interest: 'Imóvel premium',
      propertyFocus: 'Casa no Altiplano',
      source: 'Indicação',
      priority: 'Alta',
      status: 'Pendente',
      date: 'Ontem',
    },
    {
      id: 4,
      client: 'Eduardo Martins',
      phone: '(83) 99666-3322',
      interest: 'Comprar casa',
      propertyFocus: 'Condomínio familiar',
      source: 'Busca no site',
      priority: 'Baixa',
      status: 'Convertido',
      date: '12/06/2026',
    },
  ];

  visits: BrokerVisit[] = [
    {
      id: 1,
      client: 'Mariana Souza',
      property: 'Apartamento em Cabo Branco',
      date: 'Hoje',
      hour: '14:30',
      status: 'Marcada',
    },
    {
      id: 2,
      client: 'Lucas Ferreira',
      property: 'Casa no Bessa',
      date: 'Hoje',
      hour: '16:00',
      status: 'Marcada',
    },
    {
      id: 3,
      client: 'Eduardo Martins',
      property: 'Condomínio familiar',
      date: 'Ontem',
      hour: '09:00',
      status: 'Realizada',
    },
  ];

  proposals: BrokerProposal[] = [
    {
      id: 1,
      client: 'Mariana Souza',
      property: 'Apartamento em Cabo Branco',
      value: 'R$ 610.000',
      stage: 'Contato',
      lastUpdate: 'Hoje',
    },
    {
      id: 2,
      client: 'Lucas Ferreira',
      property: 'Casa no Bessa',
      value: 'R$ 4.500/mês',
      stage: 'Visita',
      lastUpdate: 'Hoje',
    },
    {
      id: 3,
      client: 'Rafaela Lima',
      property: 'Casa no Altiplano',
      value: 'R$ 1.200.000',
      stage: 'Proposta',
      lastUpdate: 'Ontem',
    },
    {
      id: 4,
      client: 'Eduardo Martins',
      property: 'Condomínio familiar',
      value: 'R$ 735.000',
      stage: 'Fechamento',
      lastUpdate: '12/06/2026',
    },
  ];

  selectedLeadId = 1;

  get pendingLeads(): BrokerLead[] {
    return this.leads.filter((lead) => lead.status === 'Pendente');
  }

  get todayVisits(): BrokerVisit[] {
    return this.visits.filter((visit) => visit.date === 'Hoje' && visit.status === 'Marcada');
  }

  get activeProposals(): BrokerProposal[] {
    return this.proposals.filter((proposal) => proposal.stage !== 'Fechamento');
  }

  get convertedLeads(): BrokerLead[] {
    return this.leads.filter((lead) => lead.status === 'Convertido');
  }

  get conversionRate(): number {
    if (this.leads.length === 0) return 0;
    return Math.round((this.convertedLeads.length / this.leads.length) * 100);
  }

  get filteredLeads(): BrokerLead[] {
    return this.leads.filter((lead) => {
      const matchesFilter =
        this.activeLeadFilter === 'Todos' || lead.status === this.activeLeadFilter;

      const term = this.atendimentoSearchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        lead.client.toLowerCase().includes(term) ||
        lead.interest.toLowerCase().includes(term) ||
        lead.propertyFocus.toLowerCase().includes(term) ||
        lead.phone.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }

  get selectedLead(): BrokerLead | undefined {
    return this.leads.find((lead) => lead.id === this.selectedLeadId);
  }

  setSection(section: BrokerSection): void {
    this.activeSection = section;
  }

  selectLead(lead: BrokerLead): void {
    this.selectedLeadId = lead.id;
  }

  startLeadAttendance(lead: BrokerLead): void {
    lead.status = 'Em atendimento';
    this.selectedLeadId = lead.id;
    this.showActionMessage(`Atendimento de ${lead.client} iniciado.`);
  }

  convertLead(lead: BrokerLead): void {
    lead.status = 'Convertido';
    this.showActionMessage(`${lead.client} marcado como convertido.`);
  }

  markVisitDone(visit: BrokerVisit): void {
    visit.status = 'Realizada';
    this.showActionMessage('Visita marcada como realizada.');
  }

  cancelVisit(visit: BrokerVisit): void {
    visit.status = 'Cancelada';
    this.showActionMessage('Visita cancelada com sucesso.');
  }

  getProposalsByStage(stage: ProposalStage): BrokerProposal[] {
    return this.proposals.filter((proposal) => proposal.stage === stage);
  }

  moveProposal(proposal: BrokerProposal, direction: 1 | -1): void {
    const currentIndex = this.proposalStages.indexOf(proposal.stage);
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= this.proposalStages.length) return;

    proposal.stage = this.proposalStages[nextIndex];
    proposal.lastUpdate = 'Agora';

    this.showActionMessage(`Proposta de ${proposal.client} movida para "${proposal.stage}".`);
  }

  canMoveProposal(proposal: BrokerProposal, direction: 1 | -1): boolean {
    const currentIndex = this.proposalStages.indexOf(proposal.stage);
    const nextIndex = currentIndex + direction;
    return nextIndex >= 0 && nextIndex < this.proposalStages.length;
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

  clearLeadFilters(): void {
    this.activeLeadFilter = 'Todos';
    this.atendimentoSearchTerm = '';
  }

  private showActionMessage(message: string): void {
    this.actionMessage = message;

    setTimeout(() => {
      this.actionMessage = '';
    }, 3500);
  }
}