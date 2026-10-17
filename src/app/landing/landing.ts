import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { AvailabilityDialog } from './availability-dialog';
import { Icon, IconName } from './icon';
import { HeroBackground } from './hero-background';
import { ActionLabel } from './action-label';
import { PlatformOverview } from './platform-overview';
import { Faq } from './faq';

@Component({
  selector: 'app-landing',
  imports: [AvailabilityDialog, Icon, HeroBackground, ActionLabel, PlatformOverview, Faq],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css', './landing-sections.css', './landing-responsive.css'],
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
    problem: string;
    title: string;
    description: string;
  }[] = [
    {
      icon: 'clock',
      problem: 'Prazos conferidos manualmente',
      title: 'Cada contrato, seus prazos.',
      description:
        'Acompanhe resposta, atendimento em campo e resolução conforme a política de SLA do contrato.',
    },
    {
      icon: 'camera',
      problem: 'Fotos dispersas em mensagens',
      title: 'Evidências junto do serviço.',
      description:
        'Vincule os registros fotográficos ao atendimento e encontre o contexto de cada imagem.',
    },
    {
      icon: 'history',
      problem: 'Acontecimentos difíceis de reconstruir',
      title: 'Um histórico que conta tudo.',
      description:
        'Consulte as ações, os horários e os responsáveis para entender o caminho de cada chamado.',
    },
    {
      icon: 'users',
      problem: 'Informação fragmentada',
      title: 'Uma visão compartilhada.',
      description:
        'Conecte gestor, técnico e cliente ao mesmo chamado, com acesso conforme o papel de cada um.',
    },
  ];
  protected readonly steps = [
    {
      title: 'Configure contratos e prazos',
      description: 'Defina as políticas de SLA que orientam os três prazos de cada chamado.',
    },
    {
      title: 'Abra e distribua chamados',
      description: 'Organize a demanda, dê o primeiro retorno e atribua um técnico responsável.',
    },
    {
      title: 'Registre o atendimento',
      description: 'Documente o serviço em campo e vincule as evidências fotográficas.',
    },
    {
      title: 'Valide e acompanhe',
      description: 'O cliente valida a solução. A gestão consulta o histórico e os resultados.',
    },
  ];
  protected followAnchor(id: string): void {
    this.closeMenu(false);
    this.document.getElementById(id)?.focus({ preventScroll: true });
  }
  constructor() {
    afterNextRender(() => {
      if (typeof matchMedia === 'undefined') return;
      const desktop = matchMedia('(min-width: 901px)');
      const onResize = () => { if (desktop.matches) this.closeMenu(); };
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
  protected onMenuBackdrop(event: MouseEvent): void {
    if (event.target !== this.mobileMenu().nativeElement) return;
    const rect = this.mobileMenu().nativeElement.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientX < rect.left || event.clientX > rect.right) this.closeMenu();
  }
  protected openMobileAvailability(): void {
    this.closeMenu(false);
    this.access().open(this.menuButton().nativeElement);
  }
  protected keepMenuFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const items = this.mobileMenu().nativeElement.querySelectorAll<HTMLElement>('a[href], button');
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && this.document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && this.document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
}
