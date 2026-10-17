import { Component } from '@angular/core';
import { ProductPreview } from './product-preview';
import { Icon, IconName } from './icon';

@Component({
  selector: 'app-platform-overview',
  imports: [ProductPreview, Icon],
  templateUrl: './platform-overview.html',
  styleUrl: './platform-overview.css',
})
export class PlatformOverview {
  protected readonly featureIcons: IconName[] = ['file', 'camera', 'history'];
  protected readonly features = [
    {
      title: 'Contratos e chamados',
      description:
        'Regras de prazo vinculadas ao contrato de cada cliente. Demandas organizadas do primeiro registro até a validação da solução, com responsáveis definidos.',
    },
    {
      title: 'Prazos e evidências',
      description:
        'Resposta, atendimento em campo e resolução acompanhados separadamente. Fotos vinculadas ao atendimento para documentar o serviço executado.',
    },
    {
      title: 'Notificações, relatórios e histórico',
      description:
        'Avisos sobre os acontecimentos dos chamados. Consulta aos resultados e às ações registradas, com data e responsável.',
    },
  ];
  protected readonly roles = [
    {
      name: 'Gestor',
      action: 'Organiza e acompanha.',
      description:
        'Configura contratos, distribui chamados e consulta prazos, relatórios e histórico.',
    },
    {
      name: 'Técnico',
      action: 'Executa e comprova.',
      description:
        'Acompanha os chamados atribuídos, registra o atendimento e envia as evidências.',
    },
    {
      name: 'Cliente',
      action: 'Solicita e valida.',
      description: 'Abre chamados, acompanha o andamento e valida a solução apresentada.',
    },
  ];
}
