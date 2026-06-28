import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { FooterComponent } from '../../components/layout/footer/footer.component';
import { NavbarComponent } from '../../components/layout/navbar/navbar.component';
import { ImovelService } from '../../../service/imovel.service';
import { AtendimentoService } from '../../../service/atendimento.service';

/* ── Tipos ─────────────────────────────────────────────────── */
interface FormField {
  value: string;
  touched: boolean;
  error: string;
}

type FormKey = 'nome' | 'telefone' | 'interesse';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './landing.html',
  styleUrls: ['../../app.css'],
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  /* ── Injeções ───────────────────────────────────────────── */
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly imovelService = inject(ImovelService);
  private atendimento = inject(AtendimentoService);

  private gsapCtx?: any;
  private sectionObserver?: IntersectionObserver;
  private initTimer?: ReturnType<typeof setTimeout>;

  /* ── ViewChild: carrosséis ──────────────────────────────── */
  @ViewChild('regionsCarousel') regionsCarouselRef?: ElementRef<HTMLDivElement>;
  @ViewChild('testimonialsCarousel') testimonialsCarouselRef?: ElementRef<HTMLDivElement>;

  /* ── Estado geral ───────────────────────────────────────── */
  showBackToTop = false;
  activeSection = 'inicio';

  /* ── Estado: carrossél de regiões ───────────────────────── */
  activeRegionIndex = 0;
  isRegionsBeginning = true;
  isRegionsEnd = false;

  /* ── Estado: carrossél de depoimentos ───────────────────── */
  activeTestimonialIndex = 0;
  isTestimonialsBeginning = true;
  isTestimonialsEnd = false;

  /* ── Estado: filtro de imóveis ──────────────────────────── */
  activeFilter = 'Todos';
  readonly propertyFilters = ['Todos', 'Casa', 'Apartamento', 'Condomínio', 'Premium'];

  /* ── Estado: formulário ─────────────────────────────────── */
  form: Record<FormKey, FormField> = {
    nome: { value: '', touched: false, error: '' },
    telefone: { value: '', touched: false, error: '' },
    interesse: { value: '', touched: false, error: '' },
  };
  formSubmitting = false;
  formSuccess = false;

  /* ══════════════════════════════════════════════════════════
     DADOS
  ══════════════════════════════════════════════════════════ */

  benefits = [
    {
      icon: '⌂',
      title: 'Compra e venda',
      description:
        'Assessoria completa para comprar ou vender seu imóvel com segurança, agilidade e poder de decisão.',
    },
    {
      icon: '◆',
      title: 'Locação de imóveis',
      description:
        'Casas, apartamentos e pontos comerciais selecionados para diferentes perfis e necessidades.',
    },
  ];

  services = [
    {
      icon: '⊕',
      title: 'Curadoria personalizada',
      description:
        'Seleção de imóveis de acordo com seu perfil, orçamento, localização desejada e momento de vida.',
    },
    {
      icon: '✓',
      title: 'Negociação segura',
      description:
        'Apoio na análise de documentos, proposta comercial e condução da negociação com transparência.',
    },
    {
      icon: '↗',
      title: 'Visitas agendadas',
      description:
        'Organização de visitas presenciais ou digitais para você conhecer os imóveis com praticidade.',
    },
  ];

  properties: any[] = [];

  stats = [
    {
      prefix: '+',
      value: 120,
      suffix: '',
      label: 'Imóveis selecionados',
      description: 'Opções avaliadas para diferentes perfis, regiões e necessidades.',
    },
    {
      prefix: '',
      value: 98,
      suffix: '%',
      label: 'Satisfação no atendimento',
      description: 'Acompanhamento próximo para tornar a decisão mais simples e segura.',
    },
    {
      prefix: '',
      value: 24,
      suffix: 'h',
      label: 'Atendimento digital',
      description: 'Fale com a equipe, tire dúvidas e organize visitas com praticidade.',
    },
  ];

  steps = [
    {
      number: 1,
      title: 'Conte o que você procura',
      description: 'Entendemos sua rotina, orçamento, localização desejada e prioridades.',
    },
    {
      number: 2,
      title: 'Receba uma seleção de imóveis',
      description: 'Apresentamos opções alinhadas ao seu perfil, sem excesso de escolhas.',
    },
    {
      number: 3,
      title: 'Visite, compare e decida',
      description: 'Acompanhamos visitas, documentação e negociação final com você.',
    },
  ];

  locations = [
    {
      name: 'Altiplano',
      count: 18,
      image: 'assets/img/property-3.png',
      alt: 'Imóvel no Altiplano',
      description: 'Região valorizada, moderna e próxima aos principais serviços.',
    },
    {
      name: 'Cabo Branco',
      count: 24,
      image: 'assets/img/property-5.png',
      alt: 'Imóvel em Cabo Branco',
      description: 'Ideal para quem busca qualidade de vida perto da orla.',
    },
    {
      name: 'Bessa',
      count: 31,
      image: 'assets/img/property-6.png',
      alt: 'Imóvel no Bessa',
      description: 'Conforto e praticidade para famílias.',
    },
    {
      name: 'Manaíra',
      count: 27,
      image: 'assets/img/property-4.png',
      alt: 'Imóvel em Manaíra',
      description: 'Bairro tradicional, comércio variado e boa infraestrutura.',
    },
    {
      name: 'Tambaú',
      count: 22,
      image: 'assets/img/property-2.png',
      alt: 'Imóvel em Tambaú',
      description: 'Localização nobre para quem busca exclusividade.',
    },
  ];

  testimonials = [
    {
      name: 'Mariana e Lucas',
      context: 'Compra residencial',
      rating: 5,
      text: 'A PrimeLar entendeu exatamente o que buscávamos. Visitamos poucos imóveis, mas todos faziam sentido para nossa família.',
    },
    {
      name: 'Rafael Moreira',
      context: 'Venda de imóvel',
      rating: 5,
      text: 'O atendimento foi claro do início ao fim. Negociamos com segurança e sem aquela sensação de estar perdido no processo.',
    },
    {
      name: 'Camila Fernandes',
      context: 'Locação',
      rating: 5,
      text: 'Precisávamos de algo rápido para alugar e a equipe organizou tudo de forma prática, com boas opções e suporte.',
    },
    {
      name: 'Eduardo Silva',
      context: 'Compra de apartamento',
      rating: 5,
      text: 'A curadoria personalizada fez toda a diferença. Recebi opções alinhadas ao meu perfil e decidi com mais confiança.',
    },
  ];

  faqs = [
    {
      question: 'A PrimeLar trabalha com compra, venda e locação?',
      answer:
        'Sim. A equipe atua com imóveis para compra, venda e aluguel, sempre buscando opções compatíveis com o perfil do cliente.',
    },
    {
      question: 'Posso agendar uma visita online?',
      answer:
        'Sim. Você pode solicitar atendimento e combinar visitas presenciais ou digitais conforme sua disponibilidade.',
    },
    {
      question: 'A imobiliária ajuda na negociação?',
      answer:
        'Sim. A PrimeLar auxilia na proposta, análise de documentos e condução da negociação de forma clara e segura.',
    },
    {
      question: 'Qual é o prazo médio para fechar um negócio?',
      answer:
        'Varia conforme o tipo de transação, mas nossa equipe trabalha para agilizar cada etapa — geralmente entre 15 e 45 dias.',
    },
  ];

  /* ══════════════════════════════════════════════════════════
     GETTERS COMPUTADOS
  ══════════════════════════════════════════════════════════ */

  /** H8 – Minimalism: exibe apenas propriedades do filtro ativo */
  get filteredProperties() {
    if (this.activeFilter === 'Todos') return this.properties;
    return this.properties.filter((p) => p.type === this.activeFilter);
  }

  /* ══════════════════════════════════════════════════════════
     HOST LISTENERS
  ══════════════════════════════════════════════════════════ */

  /** H1 – Status: back-to-top visível após 400 px */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop = window.scrollY > 400;
  }

  /* ══════════════════════════════════════════════════════════
     LIFECYCLE
  ══════════════════════════════════════════════════════════ */

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.carregarImoveis();

    // Dynamically import AOS and GSAP only in the browser.
    Promise.all([import('aos'), import('gsap'), import('gsap/ScrollTrigger')])
      .then(([AOSModule, gsapModule, ScrollTriggerModule]) => {
        const AOSLib =
          AOSModule && (AOSModule as any).default ? (AOSModule as any).default : AOSModule;
        const gsapLib =
          gsapModule && (gsapModule as any).gsap ? (gsapModule as any).gsap : gsapModule;
        const ScrollTrigger =
          ScrollTriggerModule && (ScrollTriggerModule as any).ScrollTrigger
            ? (ScrollTriggerModule as any).ScrollTrigger
            : ((ScrollTriggerModule as any).default ?? ScrollTriggerModule);

        // Store reference for later use in animations
        (this as any).gsapLib = gsapLib;

        try {
          gsapLib.registerPlugin(ScrollTrigger);
        } catch (e) {
          // ignore plugin registration errors silently
        }

        AOSLib?.init?.({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 80 });

        this.initTimer = setTimeout(() => {
          this.initSectionObserver();
          this.initGsapAnimations();
          AOSLib?.refreshHard?.();
        }, 100);
      })
      .catch(() => {
        // If dynamic imports fail, still initialize observers/timers
        this.initTimer = setTimeout(() => {
          this.initSectionObserver();
          this.initGsapAnimations();
        }, 100);
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this.initTimer);
    this.gsapCtx?.revert();
    this.sectionObserver?.disconnect();
  }

  /* ══════════════════════════════════════════════════════════
     CARROSSÉL — REGIÕES  (scroll-snap nativo)
  ══════════════════════════════════════════════════════════ */

  scrollRegions(direction: 1 | -1): void {
    const el = this.regionsCarouselRef?.nativeElement;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('.carousel-item');
    const slideW = (slide?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: direction * slideW, behavior: 'smooth' });
    setTimeout(() => this.syncRegionsState(), 650);
  }

  goToRegion(index: number): void {
    const el = this.regionsCarouselRef?.nativeElement;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('.carousel-item');
    const slideW = (slide?.offsetWidth ?? 320) + 24;
    el.scrollTo({ left: index * slideW, behavior: 'smooth' });
    setTimeout(() => this.syncRegionsState(), 650);
  }

  /** H1 – Status: sincroniza indicadores com scroll real */
  onRegionsScroll(): void {
    this.syncRegionsState();
  }

  private syncRegionsState(): void {
    const el = this.regionsCarouselRef?.nativeElement;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('.carousel-item');
    const slideW = (slide?.offsetWidth ?? 320) + 24;
    this.activeRegionIndex = Math.round(el.scrollLeft / slideW);
    this.isRegionsBeginning = el.scrollLeft < 8;
    this.isRegionsEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
  }

  /* ══════════════════════════════════════════════════════════
     CARROSSÉL — DEPOIMENTOS  (scroll-snap nativo)
  ══════════════════════════════════════════════════════════ */

  scrollTestimonials(direction: 1 | -1): void {
    const el = this.testimonialsCarouselRef?.nativeElement;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('.carousel-item');
    const slideW = (slide?.offsetWidth ?? 320) + 20;
    el.scrollBy({ left: direction * slideW, behavior: 'smooth' });
    setTimeout(() => this.syncTestimonialsState(), 650);
  }

  goToTestimonial(index: number): void {
    const el = this.testimonialsCarouselRef?.nativeElement;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('.carousel-item');
    const slideW = (slide?.offsetWidth ?? 320) + 20;
    el.scrollTo({ left: index * slideW, behavior: 'smooth' });
    setTimeout(() => this.syncTestimonialsState(), 650);
  }

  onTestimonialsScroll(): void {
    this.syncTestimonialsState();
  }

  private syncTestimonialsState(): void {
    const el = this.testimonialsCarouselRef?.nativeElement;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('.carousel-item');
    const slideW = (slide?.offsetWidth ?? 320) + 20;
    this.activeTestimonialIndex = Math.round(el.scrollLeft / slideW);
    this.isTestimonialsBeginning = el.scrollLeft < 8;
    this.isTestimonialsEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
  }

  /* ══════════════════════════════════════════════════════════
     FORMULÁRIO
  ══════════════════════════════════════════════════════════ */

  /** H9 – Error recovery: mensagem específica por campo */
  private validateField(field: FormKey): void {
    const val = this.form[field].value;

    if (field === 'nome') {
      this.form.nome.error =
        val.trim().length < 3 ? 'Informe seu nome completo (mínimo 3 caracteres)' : '';
    } else if (field === 'telefone') {
      const digits = val.replace(/\D/g, '');
      this.form.telefone.error = digits.length < 10 ? 'Informe um telefone válido com DDD' : '';
    } else if (field === 'interesse') {
      this.form.interesse.error = !val ? 'Selecione uma opção para continuar' : '';
    }
  }

  /** H5 – Error prevention: valida ao sair do campo */
  onFieldBlur(field: FormKey): void {
    this.form[field].touched = true;
    this.validateField(field);
  }

  /** H9 – Error recovery: valida em tempo real após toque */
  onFieldInput(field: FormKey, value: string): void {
    this.form[field].value = value;
    if (this.form[field].touched) this.validateField(field);
  }

  /** H5 – Error prevention: valida todos antes de enviar */
  async onSubmit() {
    this.formSubmitting = true;
    this.formSuccess = false;

    if (!this.form.nome.value || !this.form.telefone.value || !this.form.interesse.value) {
      this.formSubmitting = false;
      return;
    }

    const ok = await this.atendimento.criarAtendimento({
      nome: this.form.nome.value,
      telefone: this.form.telefone.value,
      interesse: this.form.interesse.value,
    });

    this.formSubmitting = false;

    if (!ok) {
      this.form.nome.error = 'Erro ao enviar solicitação';
      this.form.nome.touched = true;
      return;
    }

    this.formSuccess = true;

    this.form.nome.value = '';
    this.form.telefone.value = '';
    this.form.interesse.value = '';
  }

  /** H3 – User control: permite refazer o envio */
  resetForm(): void {
    this.form = {
      nome: { value: '', touched: false, error: '' },
      telefone: { value: '', touched: false, error: '' },
      interesse: { value: '', touched: false, error: '' },
    };
    this.formSuccess = false;
  }

  async carregarImoveis(): Promise<void> {
    this.properties = await this.imovelService.getImoveis();
  }

  /** H3 – User control: volta ao topo suavemente */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ══════════════════════════════════════════════════════════
     INTERNOS
  ══════════════════════════════════════════════════════════ */

  /** H6 – Recognition: seção ativa destaca link na nav */
  private initSectionObserver(): void {
    const sectionIds = ['inicio', 'imoveis', 'sobre', 'servicos', 'depoimentos', 'contato'];

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.activeSection = entry.target.id;
        });
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.sectionObserver?.observe(el);
    });
  }

  private initGsapAnimations(): void {
    const gsapLib =
      (this as any).gsapLib ??
      (typeof (window as any).gsap !== 'undefined' ? (window as any).gsap : null);
    if (!gsapLib) return;

    gsapLib.registerPlugin?.(gsapLib.ScrollTrigger ?? (gsapLib as any).ScrollTrigger);

    this.gsapCtx = gsapLib.context(() => {
      /* Hero: entrada escalonada */
      gsapLib.from('.hero-kicker, .hero-title, .hero-description, .hero-actions', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });

      /* Stats: contador animado */
      (this.host.nativeElement.querySelectorAll('.stat-number') as NodeListOf<HTMLElement>).forEach(
        (el) => {
          const value = Number(el.dataset['value'] ?? 0);
          const prefix = el.dataset['prefix'] ?? '';
          const suffix = el.dataset['suffix'] ?? '';
          const counter = { v: 0 };

          gsapLib.to(counter, {
            v: value,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(counter.v)}${suffix}`;
            },
          });
        },
      );
    }, this.host.nativeElement);
  }
}
