import { Component } from '@angular/core';
import { ProductPreview } from '../product-preview/product-preview';
import { Icon, IconName } from '../icon/icon';

@Component({
  selector: 'app-platform-overview',
  imports: [ProductPreview, Icon],
  templateUrl: './platform-overview.html',
  host: { class: 'block' },
})
export class PlatformOverview {
  protected readonly featureIcons: IconName[] = ['file', 'camera', 'history'];
  protected readonly features = [
    {
      title: 'Contratos e chamados',
      description: 'Demandas vinculadas ao contrato, com prazos e responsáveis definidos.',
    },
    {
      title: 'Prazos e evidências',
      description: 'Três prazos acompanhados separadamente, com fotos do serviço no chamado.',
    },
    {
      title: 'Notificações, relatórios e histórico',
      description: 'Avisos dos chamados, relatórios e ações registradas com data e responsável.',
    },
  ];
  protected readonly roles = [
    {
      name: 'Gestor',
      action: 'Organiza e acompanha.',
      description: 'Define contratos, distribui demandas e consulta prazos e resultados.',
    },
    {
      name: 'Técnico',
      action: 'Executa e comprova.',
      description: 'Atende chamados atribuídos e registra o serviço com fotos.',
    },
    {
      name: 'Cliente',
      action: 'Solicita e valida.',
      description: 'Abre chamados, acompanha o andamento e valida a solução.',
    },
  ];
}
