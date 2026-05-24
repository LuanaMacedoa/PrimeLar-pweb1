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
import { FooterComponent } from '../layout/footer/footer.component';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import AOS from 'aos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  private gsapCtx?: gsap.Context;
  private sectionObserver?: IntersectionObserver;
  private initTimer?: ReturnType<typeof setTimeout>;

  /* ── ViewChild: carrosséis ──────────────────────────────── */
  @ViewChild('regionsCarousel') regionsCarouselRef?: ElementRef<HTMLDivElement>;
  @ViewChild('testimonialsCarousel') testimonialsCarouselRef?: ElementRef<HTMLDivElement>;

  /* ── Estado geral ───────────────────────────────────────── */
  showBackToTop = false;
  activeSection = 'inicio';
  windowWidth = isPlatformBrowser(inject(PLATFORM_ID))
    ? window.innerWidth
    : 1200;

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
  formError = false;

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

  properties = [
    {
      id: 1,
      name: 'Residência Prime',
      category: 'Casa familiar',
      type: 'Casa',
      info: '3 quartos · 2 vagas',
      badge: 'Destaque',
      image: 'assets/img/property-1.png',
      alt: 'Casa de alto padrão com três quartos',
    },
    {
      id: 2,
      name: 'Vista Central',
      category: 'Apartamento',
      type: 'Apartamento',
      info: '2 quartos · 1 vaga',
      badge: 'Novo',
      image: 'assets/img/property-2.png',
      alt: 'Apartamento moderno com dois quartos',
    },
    {
      id: 3,
      name: 'Mansão Jardins',
      category: 'Alto padrão',
      type: 'Premium',
      info: '4 quartos · 3 vagas',
      badge: 'Premium',
      image: 'assets/img/property-3.png',
      alt: 'Imóvel premium com quatro quartos',
    },
    {
      id: 4,
      name: 'Casa Horizonte',
      category: 'Espaço completo',
      type: 'Casa',
      info: '5 quartos · 4 vagas',
      badge: 'Família',
      image: 'assets/img/property-4.png',
      alt: 'Casa espaçosa com cinco quartos',
    },
    {
      id: 5,
      name: 'Varanda Bella',
      category: 'Condomínio',
      type: 'Condomínio',
      info: '3 quartos · 2 vagas',
      badge: 'Lazer',
      image: 'assets/img/property-5.png',
      alt: 'Apartamento sofisticado em condomínio',
    },
  ];

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

  /** H5 – Error prevention: bloqueia submit enquanto inválido */
  get formValid(): boolean {
    return (
      this.form.nome.value.trim().length >= 3 &&
      this.form.telefone.value.replace(/\D/g, '').length >= 10 &&
      !!this.form.interesse.value
    );
  }

  /** H1 – Status: label de posição do carrossél de regiões */
  get regionStatusLabel(): string {
    return `Região ${this.activeRegionIndex + 1} de ${this.locations.length}`;
  }

  /** H1 – Status: label de posição do carrossél de depoimentos */
  get testimonialStatusLabel(): string {
    return `Depoimento ${this.activeTestimonialIndex + 1} de ${this.testimonials.length}`;
  }

  /* ══════════════════════════════════════════════════════════
     HOST LISTENERS
  ══════════════════════════════════════════════════════════ */

  /** H1 – Status: back-to-top visível após 400 px */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop = window.scrollY > 400;
  }

  /** H7 – Efficiency: largura da janela para layout responsivo */
  @HostListener('window:resize')
  onResize(): void {
    this.windowWidth = window.innerWidth;
  }

  /* ══════════════════════════════════════════════════════════
     LIFECYCLE
  ══════════════════════════════════════════════════════════ */

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 80 });

    this.initTimer = setTimeout(() => {
      this.initSectionObserver();
      this.initGsapAnimations();
      AOS.refreshHard();
    }, 100);
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
      this.form.telefone.error =
        digits.length < 10 ? 'Informe um telefone válido com DDD' : '';
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
  onSubmit(): void {
    (Object.keys(this.form) as FormKey[]).forEach((k) => {
      this.form[k].touched = true;
      this.validateField(k);
    });

    if (!this.formValid) return;

    this.formSubmitting = true;
    this.formError = false;

    // Simula chamada de API
    setTimeout(() => {
      this.formSubmitting = false;
      this.formSuccess = true;
    }, 1600);
  }

  /** H3 – User control: permite refazer o envio */
  resetForm(): void {
    this.form = {
      nome: { value: '', touched: false, error: '' },
      telefone: { value: '', touched: false, error: '' },
      interesse: { value: '', touched: false, error: '' },
    };
    this.formSuccess = false;
    this.formError = false;
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
    gsap.registerPlugin(ScrollTrigger);

    this.gsapCtx = gsap.context(() => {
      /* Hero: entrada escalonada */
      gsap.from('.hero-kicker, .hero-title, .hero-description, .hero-actions', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });

      /* Stats: contador animado */
      (this.host.nativeElement.querySelectorAll('.stat-number') as NodeListOf<HTMLElement>)
        .forEach((el) => {
          const value = Number(el.dataset['value'] ?? 0);
          const prefix = el.dataset['prefix'] ?? '';
          const suffix = el.dataset['suffix'] ?? '';
          const counter = { v: 0 };

          gsap.to(counter, {
            v: value,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(counter.v)}${suffix}`;
            },
          });
        });
    }, this.host.nativeElement);
  }
}