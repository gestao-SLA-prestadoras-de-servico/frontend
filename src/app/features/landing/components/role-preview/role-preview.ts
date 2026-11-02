import { Card } from '../../../../shared/ui/card';
import { SectionHeading } from '../../../../shared/ui/section-heading';
import { Contour } from '../contour/contour';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChildren,
} from '@angular/core';
import { Icon, IconName } from '../icon/icon';
import { Reveal } from '../../reveal.directive';
import { ButtonPrimary } from '../../../../shared/ui/button';

@Component({
  selector: 'app-role-preview',
  host: { class: 'block' },
  imports: [SectionHeading, Card, Contour, Icon, Reveal, ButtonPrimary],
  templateUrl: './role-preview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolePreview {
  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('roleTab');
  protected readonly portraits = ['gestor', 'tecnico', 'cliente'];
  protected readonly selected = signal(0);
  protected readonly simulated = signal(false);
  protected readonly roles: {
    name: string;
    icon: IconName;
    title: string;
    description: string;
    tasks: string[];
    label: string;
    initial: string;
    result: string;
    action: string;
    feedback: string;
  }[] = [
    {
      name: 'Gestor',
      icon: 'users',
      title: 'Organiza e acompanha.',
      description:
        'Uma visão do compromisso até a entrega, para orientar a equipe com o contexto de cada contrato.',
      tasks: [
        'Define contratos e políticas de prazo',
        'Distribui chamados entre os técnicos',
        'Consulta prazos, relatórios e resultados',
      ],
      label: 'Distribuição do atendimento',
      initial: 'Aguardando atribuição',
      result: 'Atribuído a João · Técnico',
      action: 'Simular distribuição',
      feedback: 'Nesta simulação, o chamado foi atribuído a João. Nenhuma informação foi enviada.',
    },
    {
      name: 'Técnico',
      icon: 'camera',
      title: 'Executa e comprova.',
      description:
        'O chamado acompanha o trabalho em campo, com as informações do serviço e espaço para documentar o atendimento.',
      tasks: [
        'Consulta os chamados atribuídos',
        'Registra o início do atendimento',
        'Documenta o serviço com fotos',
      ],
      label: 'Registro de evidências',
      initial: '2 fotos vinculadas',
      result: '3 fotos vinculadas',
      action: 'Simular registro',
      feedback:
        'Uma evidência de exemplo foi adicionada à demonstração. Nenhum arquivo foi enviado.',
    },
    {
      name: 'Cliente',
      icon: 'check',
      title: 'Solicita e valida.',
      description:
        'Mais contexto para acompanhar a solicitação, consultar os registros e validar a solução apresentada.',
      tasks: [
        'Abre chamados de serviço',
        'Acompanha o andamento do atendimento',
        'Consulta evidências e valida a solução',
      ],
      label: 'Validação da solução · cenário de exemplo',
      initial: 'Solução aguardando validação',
      result: 'Solução validada pelo cliente',
      action: 'Simular validação',
      feedback:
        'A solução de exemplo foi validada nesta demonstração. O chamado ilustrativo principal permanece em atendimento.',
    },
  ];

  protected select(index: number): void {
    this.selected.set(index);
    this.simulated.set(false);
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = (index + 1) % this.roles.length;
        break;
      case 'ArrowLeft':
        next = (index + this.roles.length - 1) % this.roles.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = this.roles.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(next);
    this.tabs()[next].nativeElement.focus();
  }
}
