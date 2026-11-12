import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideImageOff } from '@lucide/angular';
import { PurgedEvidenceMetadata } from '../data/purged-evidence-demo-data';
import { ManagerPanel, ManagerSectionHeading } from './manager-surface.directive';

@Component({
  selector: 'app-manager-purged-evidence-card',
  imports: [LucideImageOff, ManagerPanel, ManagerSectionHeading],
  template: `
    <section appManagerPanel aria-labelledby="purged-evidence-title">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 appManagerSectionHeading id="purged-evidence-title">Rastreabilidade da evidência</h2>
        <span
          class="inline-flex items-center gap-2 rounded-status bg-bg px-3 py-2 text-xs font-semibold text-ink2"
          ><svg lucideImageOff class="size-4" aria-hidden="true"></svg>EXPURGADA</span
        >
      </div>
      <p class="mt-5 max-w-[70ch] text-sm leading-relaxed text-ink2">
        O conteúdo desta evidência está indisponível após o expurgo. Somente os metadados de
        rastreabilidade permanecem neste exemplo; não há imagem para visualizar ou baixar.
      </p>
      <dl class="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <dt class="text-[13px] text-ink2">Identificador da evidência</dt>
          <dd class="m-0 mt-1 text-sm font-semibold wrap-anywhere">{{ evidence().id }}</dd>
        </div>
        <div>
          <dt class="text-[13px] text-ink2">Atendimento relacionado</dt>
          <dd class="m-0 mt-1 text-sm font-semibold wrap-anywhere">{{ evidence().serviceId }}</dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-[13px] text-ink2">Chamado relacionado</dt>
          <dd class="m-0 mt-1 text-sm">
            #{{ evidence().ticketId }} · {{ evidence().ticketTitle }}
          </dd>
        </div>
        <div>
          <dt class="text-[13px] text-ink2">Data de envio</dt>
          <dd class="m-0 mt-1 text-sm tabular-nums">
            <time [attr.datetime]="evidence().uploadedAt">{{ evidence().uploadedLabel }}</time>
          </dd>
        </div>
        <div>
          <dt class="text-[13px] text-ink2">Data de expurgo</dt>
          <dd class="m-0 mt-1 text-sm tabular-nums">
            <time [attr.datetime]="evidence().purgedAt">{{ evidence().purgedLabel }}</time>
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-[13px] text-ink2">Motivo registrado</dt>
          <dd class="m-0 mt-1 text-sm wrap-anywhere">{{ evidence().reason }}</dd>
        </div>
      </dl>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ManagerPurgedEvidenceCard {
  readonly evidence = input.required<PurgedEvidenceMetadata>();
}
