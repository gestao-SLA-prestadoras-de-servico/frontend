import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonSecondary } from '@app/shared/ui/button';
import { profileByKey } from '../../data/workspace-data';
import { ManagerPageHeader } from '../components/manager-page-header';
import { ManagerPanel, ManagerSectionHeading } from '../components/manager-surface.directive';

@Component({
  selector: 'app-manager-preview',
  imports: [RouterLink, ButtonSecondary, ManagerPageHeader, ManagerPanel, ManagerSectionHeading],
  template: `
    @if (page(); as current) {
      <app-manager-page-header
        [title]="current.title"
        [description]="current.description"
        demo="Demonstração com dados fictícios. Nenhuma operação real é executada."
      />
      @if (current.preview; as preview) {
        <section appManagerPanel class="mt-6" aria-labelledby="manager-preview-heading">
          <h2 appManagerSectionHeading id="manager-preview-heading">{{ preview.title }}</h2>
          <p class="mt-2 max-w-[70ch] text-sm leading-[1.7] text-ink2">{{ preview.description }}</p>
          <dl class="mt-6 grid gap-5 lg:grid-cols-3">
            @for (fact of preview.facts; track fact.label) {
              <div class="rounded-status bg-bg p-4">
                <dt class="text-xs text-ink3">{{ fact.label }}</dt>
                <dd class="m-0 mt-2 text-sm font-medium">{{ fact.value }}</dd>
              </div>
            }
          </dl>
        </section>
      }
      <a routerLink="/app/gestor" appButtonSecondary class="mt-6 min-h-11 px-4 py-2.5"
        >Voltar ao painel</a
      >
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerPreview {
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  protected readonly page = computed(() =>
    profileByKey('gestor').pages.find((page) => page.key === this.data()['page']),
  );
}
