import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/layout/footer/footer.component';
import {
  ImovelApiResponse,
  ImovelService,
  LandingImovelCard,
} from '../../../service/imovel.service';

@Component({
  selector: 'app-imoveis',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './imoveis.component.html',
  styleUrls: ['../../app.css'],
})
export class ImoveisComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly imovelService = inject(ImovelService);

  loading = false;
  errorMessage = '';
  selectedImovel: ImovelApiResponse | null = null;
  imoveis: LandingImovelCard[] = [];

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      await this.carregarDetalhe(Number(idParam));
      return;
    }

    await this.carregarLista();
  }

  async carregarLista(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.imoveis = await this.imovelService.getImoveis();
    } catch {
      this.errorMessage = 'Não foi possível carregar os imóveis agora.';
      this.imoveis = [];
    } finally {
      this.loading = false;
    }
  }

  async carregarDetalhe(id: number): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.selectedImovel = Number.isNaN(id) ? null : await this.imovelService.buscarPorId(id);
      this.imoveis = await this.imovelService.getImoveis();

      if (!this.selectedImovel) {
        this.errorMessage = 'Imóvel não encontrado.';
      }
    } catch {
      this.errorMessage = 'Não foi possível carregar os detalhes do imóvel.';
      this.selectedImovel = null;
      this.imoveis = [];
    } finally {
      this.loading = false;
    }
  }

  voltarParaLista(): void {
    this.selectedImovel = null;
    void this.carregarLista();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
  }

  formatRooms(value?: number | null): string {
    return value ? `${value} quarto(s)` : 'Informação não disponível';
  }

  formatBathrooms(value?: number | null): string {
    return value ? `${value} banheiro(s)` : 'Informação não disponível';
  }

  formatVacancies(value?: number | null): string {
    return value ? `${value} vaga(s)` : 'Informação não disponível';
  }

  getImage(card: LandingImovelCard): string {
    return card.image;
  }

  getDetailImage(path?: string | null): string {
    return this.imovelService.resolveImageUrl(path);
  }
}
