import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActionLabel } from './components/action-label/action-label';
import { AvailabilityDialog } from './components/availability-dialog/availability-dialog';
import { Faq } from './components/faq/faq';
import { HeroBackground } from './components/hero-background/hero-background';
import { Icon, IconName } from './components/icon/icon';
import { PlatformOverview } from './components/platform-overview/platform-overview';
import { ButtonPrimary, ButtonSecondary } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { Link } from '../../shared/ui/link';
import { SectionHeading } from '../../shared/ui/section-heading';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvailabilityDialog,
    Icon,
    HeroBackground,
    ActionLabel,
    PlatformOverview,
    Faq,
    ButtonPrimary,
    ButtonSecondary,
    Link,
    Card,
    SectionHeading,
  ],
  templateUrl: './landing.html',
  host: { class: 'block' },
})
export class Landing {
  private readonly document = inject(DOCUMENT);
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly access = viewChild.required(AvailabilityDialog);
  private readonly mobileMenu = viewChild.required<ElementRef<HTMLDialogElement>>('mobileMenu');
  private restoreMenuFocus = true;
  private readonly destroyRef = inject(DestroyRef);
  protected readonly menuOpen = signal(false);
  protected readonly benefits: {
    icon: IconName;
    title: string;
    description: string;
  }[] = [
    {
      icon: 'clock',
      title: 'Cada contrato, seus prazos.',
      description: 'Consulte os compromissos definidos para cada cliente.',
    },
    {
      icon: 'camera',
      title: 'Evidências junto do serviço.',
      description: 'Encontre as fotos no contexto do atendimento.',
    },
    {
      icon: 'history',
      title: 'Histórico do chamado.',
      description: 'Consulte ações, horários e responsáveis.',
    },
    {
      icon: 'users',
      title: 'Uma visão compartilhada.',
      description: 'Gestor, técnico e cliente com acesso conforme seu papel.',
    },
  ];
  protected readonly steps = [
    {
      title: 'Configure contratos e prazos',
      description: 'Defina os três compromissos de cada contrato.',
    },
    {
      title: 'Abra e distribua chamados',
      description: 'Registre a demanda e atribua o técnico responsável.',
    },
    {
      title: 'Registre o atendimento',
      description: 'Documente o serviço em campo com fotos.',
    },
    {
      title: 'Valide e acompanhe',
      description: 'O cliente valida a solução; a gestão acompanha os resultados.',
    },
  ];
  protected followAnchor(id: string): void {
    this.closeMenu(false);
    this.document.getElementById(id)?.focus({ preventScroll: true });
  }
  constructor() {
    afterNextRender(() => {
      if (typeof matchMedia === 'undefined') return;
      const desktop = matchMedia('(min-width: 1024px)');
      const onResize = () => {
        if (desktop.matches) this.closeMenu();
      };
      desktop.addEventListener('change', onResize);
      this.destroyRef.onDestroy(() => desktop.removeEventListener('change', onResize));
    });
  }
  protected openMenu(): void {
    this.restoreMenuFocus = true;
    this.mobileMenu().nativeElement.showModal();
    this.menuOpen.set(true);
  }
  protected closeMenu(restoreFocus = true): void {
    const dialog = this.mobileMenu().nativeElement;
    if (!dialog.open) return;
    this.restoreMenuFocus = restoreFocus;
    dialog.close();
    this.menuOpen.set(false);
  }
  protected onMenuClosed(): void {
    this.menuOpen.set(false);
    if (this.restoreMenuFocus) this.menuButton().nativeElement.focus({ preventScroll: true });
  }
  protected onMenuBackdrop(event: PointerEvent): void {
    if (event.target !== this.mobileMenu().nativeElement) return;
    const rect = this.mobileMenu().nativeElement.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientX < rect.left || event.clientX > rect.right)
      this.closeMenu();
  }
  protected openMobileAvailability(): void {
    this.closeMenu(false);
    this.access().open(this.menuButton().nativeElement);
  }

  @HostListener('keydown', ['$event'])
  protected keepMenuFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const items = this.mobileMenu().nativeElement.querySelectorAll<HTMLElement>('a[href], button');
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
