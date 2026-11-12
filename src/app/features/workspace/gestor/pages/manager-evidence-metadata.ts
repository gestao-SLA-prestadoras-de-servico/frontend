import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonSecondary } from '@app/shared/ui/button';
import { ManagerPageHeader } from '../components/manager-page-header';
import { ManagerPurgedEvidenceCard } from '../components/manager-purged-evidence-card';
import { PURGED_EVIDENCE_SAMPLE } from '../data/purged-evidence-demo-data';

@Component({
  selector: 'app-manager-evidence-metadata',
  imports: [RouterLink, ButtonSecondary, ManagerPageHeader, ManagerPurgedEvidenceCard],
  template: `
    <app-manager-page-header
      title="Evidência expurgada"
      [description]="evidence.id + ' · Metadados preservados para consulta.'"
      demo="Dados fictícios de um cenário histórico independente do chamado atual. Nenhum arquivo foi consultado ou removido."
    >
      <a
        managerHeaderActions
        appButtonSecondary
        routerLink="/app/gestor/auditoria"
        class="min-h-11 px-4 py-2.5"
        >Voltar à auditoria</a
      >
    </app-manager-page-header>
    <app-manager-purged-evidence-card class="mt-6" [evidence]="evidence" />
    <p class="mt-5 max-w-[75ch] text-xs leading-relaxed text-ink2">
      Horários de Brasília. A política de retenção e o expurgo automático são previstos na proposta;
      esta tela apresenta apenas o estado visual e não executa essas rotinas.
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerEvidenceMetadata {
  protected readonly evidence = PURGED_EVIDENCE_SAMPLE;
}
