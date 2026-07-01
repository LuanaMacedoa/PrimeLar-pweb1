import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FooterComponent } from '../../components/layout/footer/footer.component';
import {
  ImovelApiResponse,
  ImovelRequestPayload,
  ImovelService,
} from '../../../service/imovel.service';

interface ImovelForm {
  titulo: string;
  descricao: string;
  preco: number | null;
  cidade: string;
  bairro: string;
  endereco: string;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  caminhoImagem: string;
}

@Component({
  selector: 'app-imoveis-manager',
  standalone: true,
  imports: [FormsModule, RouterLink, FooterComponent],
  templateUrl: './imoveis-manager.component.html',
  styleUrls: ['../../app.css'],
})
export class ImoveisManagerComponent implements OnInit {
  private readonly imovelService = inject(ImovelService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  saving = false;
  errorMessage = '';
  actionMessage = '';
  editingId: number | null = null;
  imoveis: ImovelApiResponse[] = [];
  selectedImage: File | null = null;
  imagePreview = '';

  form: ImovelForm = this.buildEmptyForm();

  async ngOnInit(): Promise<void> {
    await this.carregarImoveis();
  }

  async carregarImoveis(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.imoveis = await this.imovelService.listar();
    } catch {
      this.errorMessage = 'Não foi possível carregar os imóveis.';
      this.imoveis = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  iniciarNovo(): void {
    this.editingId = null;
    this.form = this.buildEmptyForm();
    this.actionMessage = '';
  }

  editar(imovel: ImovelApiResponse): void {
    this.editingId = imovel.id;
    this.selectedImage = null;
    this.form = {
      titulo: imovel.titulo,
      descricao: imovel.descricao ?? '',
      preco: Number(imovel.preco ?? 0),
      cidade: imovel.cidade,
      bairro: imovel.bairro,
      endereco: imovel.endereco ?? '',
      quartos: imovel.quartos ?? null,
      banheiros: imovel.banheiros ?? null,
      vagas: imovel.vagas ?? null,
      caminhoImagem: imovel.caminhoImagem ?? '',
    };
    this.imagePreview = this.imovelService.resolveImageUrl(imovel.caminhoImagem);
    this.actionMessage = `Editando o imóvel #${imovel.id}.`;
  }

  async salvar(): Promise<void> {
    const titulo = this.form.titulo.trim();
    if (!titulo || titulo.length < 4) {
      this.errorMessage = 'O título deve ter pelo menos 4 caracteres.';
      return;
    }
    if (!this.form.preco || Number(this.form.preco) <= 0) {
      this.errorMessage = 'Informe um preço válido e maior que zero.';
      return;
    }
    if (!this.form.cidade.trim() || !this.form.bairro.trim()) {
      this.errorMessage = 'Preencha cidade e bairro.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const payload = this.toPayload(this.form);

    try {
      const resultado = this.selectedImage
        ? (this.editingId
          ? await this.imovelService.atualizarComImagem(this.editingId, payload, this.selectedImage)
          : await this.imovelService.criarComImagem(payload, this.selectedImage))
        : (this.editingId
          ? await this.imovelService.atualizar(this.editingId, payload)
          : await this.imovelService.criar(payload));

      if (!resultado) {
        this.errorMessage = 'Não foi possível salvar o imóvel. Verifique os dados e tente novamente.';
        return;
      }

      this.actionMessage = this.editingId
        ? `Imóvel #${resultado.id} atualizado com sucesso.`
        : `Imóvel #${resultado.id} cadastrado com sucesso.`;

      this.iniciarNovo();
      await this.carregarImoveis();
    } catch (err: unknown) {
      this.errorMessage = this.extractErrorMessage(err);
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedImage = file;

    if (!file) {
      this.imagePreview = this.editingId ? this.imagePreview : '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = String(reader.result ?? '');
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  async remover(imovel: ImovelApiResponse): Promise<void> {
    const confirmar = window.confirm(`Remover o imóvel "${imovel.titulo}"?`);
    if (!confirmar) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const ok = await this.imovelService.excluir(imovel.id);
      if (!ok) {
        this.errorMessage = 'Não foi possível remover o imóvel.';
        return;
      }

      if (this.editingId === imovel.id) {
        this.iniciarNovo();
      }

      this.actionMessage = `Imóvel #${imovel.id} removido com sucesso.`;
      await this.carregarImoveis();
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  cancelarEdicao(): void {
    this.iniciarNovo();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
  }

  resolveImageUrl(path?: string | null): string {
    return this.imovelService.resolveImageUrl(path);
  }

  private buildEmptyForm(): ImovelForm {
    return {
      titulo: '',
      descricao: '',
      preco: null,
      cidade: '',
      bairro: '',
      endereco: '',
      quartos: null,
      banheiros: null,
      vagas: null,
      caminhoImagem: '',
    };
  }

  private extractErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (body?.errors?.length) {
        return body.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(' | ');
      }
      return body?.message ?? `Erro ${err.status}: ${err.statusText}`;
    }
    return 'Erro inesperado. Tente novamente.';
  }

  private toPayload(form: ImovelForm): ImovelRequestPayload {
    return {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || undefined,
      preco: Number(form.preco ?? 0),
      cidade: form.cidade.trim(),
      bairro: form.bairro.trim(),
      endereco: form.endereco.trim() || undefined,
      quartos: form.quartos ? Number(form.quartos) : null,
      banheiros: form.banheiros ? Number(form.banheiros) : null,
      vagas: form.vagas ? Number(form.vagas) : null,
      caminhoImagem: form.caminhoImagem.trim() || undefined,
    };
  }
}
