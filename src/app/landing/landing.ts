import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { AvailabilityDialog } from './availability-dialog';
import { Icon, IconName } from './icon';
import { ProductPreview } from './product-preview';
import { PlatformOverview } from './platform-overview';
import { Faq } from './faq';

@Component({
  selector: 'app-landing',
  imports: [AvailabilityDialog, Icon, ProductPreview, PlatformOverview, Faq],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  host: { '(document:keydown.escape)': 'closeMenuWithEscape()' },
})
export class Landing {
  private readonly document = inject(DOCUMENT);
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly access = viewChild.required(AvailabilityDialog);
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
    this.menuOpen.set(false);
    this.document.getElementById(id)?.focus({ preventScroll: true });
  }
  protected closeMenuWithEscape(): void {
    if (this.menuOpen() && !this.access().isOpen) {
      this.menuOpen.set(false);
      this.menuButton().nativeElement.focus();
    }
  }
}
