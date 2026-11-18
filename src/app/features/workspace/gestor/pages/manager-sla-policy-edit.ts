import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerPanel,
  ManagerDialog,
  ManagerSectionHeading,
  ManagerLabel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { Input } from '@app/shared/ui/input/input.directive';
import { Select } from '@app/shared/ui/input/select.directive';
import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { mensagemErro } from '@app/core/api/erros';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import {
  currentPolicyVersion,
  inconsistentPriorities,
  loadSlaPolicies,
  prazosFromMatrix,
  SLA_CLOCKS,
  SLA_PRIORITIES,
  SlaClock,
  SlaPolicy,
  SlaPriority,
  windowExample,
} from '../data/sla-policy-data';
import {
  createSlaPolicyForm,
  firstInvalidPolicyField,
  matrixFromSlaPolicyForm,
  NOVA_POLITICA,
  policyField,
  SlaPolicyField,
} from '../data/sla-policy-form';

/** Ponto de partida de uma política nova: a mesma ordem que o backend exige. */
const MATRIZ_INICIAL = {
  alta: { response: 120, field: 540, resolution: 1080 },
  normal: { response: 360, field: 1080, resolution: 2160 },
};

@Component({
  selector: 'app-manager-sla-policy-edit',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonPrimary,
    ButtonSecondary,
    LucideDynamicIcon,
    Select,
    Input,
    ManagerPanel,
    ManagerDialog,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerTextAction,
    ManagerPageHeader,
    WorkspaceLoadingState,
  ],
  templateUrl: './manager-sla-policy-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerSlaPolicyEdit {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly route = inject(ActivatedRoute);
  private readonly reviewDialog = viewChild.required<ElementRef<HTMLDialogElement>>('reviewDialog');
  private readonly cancelReviewButton =
    viewChild<ElementRef<HTMLButtonElement>>('cancelReviewButton');
  private readonly reviewButton = viewChild<ElementRef<HTMLButtonElement>>('reviewButton');
  private readonly previewFeedback = viewChild<ElementRef<HTMLElement>>('previewFeedback');
  private readonly api = inject(CadastroApi);
  private trigger?: HTMLButtonElement;
  private completingPreview = false;
  private readonly requestedPolicyId = this.route.snapshot.queryParamMap.get('policy');

  protected readonly icons = WORKSPACE_ICONS;
  protected readonly novaPolitica = NOVA_POLITICA;
  protected readonly data = rxResource({ stream: () => loadSlaPolicies(this.api) });
  protected readonly loadError = computed(() =>
    this.data.error() ? mensagemErro(this.data.error()) : null,
  );
  protected readonly policies = computed(() => this.data.value() ?? []);
  protected readonly priorities = SLA_PRIORITIES;
  protected readonly clocks = SLA_CLOCKS;
  protected readonly form = createSlaPolicyForm(NOVA_POLITICA, MATRIZ_INICIAL);
  private readonly formValues = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  protected readonly isNew = computed(() => this.formValues().policyId === NOVA_POLITICA);
  protected readonly selectedPolicy = computed(() =>
    this.policies().find((policy) => policy.id === this.formValues().policyId),
  );
  protected readonly currentVersion = computed(() => {
    const policy = this.selectedPolicy();
    return policy ? currentPolicyVersion(policy) : undefined;
  });
  protected readonly editedMatrix = computed(() => {
    this.formValues();
    return matrixFromSlaPolicyForm(this.form);
  });
  private readonly formRevision = signal(0);
  protected readonly warningPriorities = computed(() => {
    this.formRevision();
    const values = this.formValues();
    const hasCompleteValues = [
      values.altaResponse,
      values.altaField,
      values.altaResolution,
      values.normalResponse,
      values.normalField,
      values.normalResolution,
    ].every((value) => typeof value === 'number' && Number.isInteger(value) && value > 0);
    return hasCompleteValues ? inconsistentPriorities(this.editedMatrix()) : [];
  });
  protected readonly submitted = signal(false);
  protected readonly busy = signal(false);
  protected readonly notice = signal<{ tone: 'success' | 'error'; text: string } | null>(null);
  private initialized = false;

  constructor() {
    // Quando as políticas chegam, abre a pedida na URL, a primeira, ou o cadastro de uma nova.
    effect(() => {
      const policies = this.policies();
      if (this.initialized || this.data.isLoading() || this.data.error()) return;
      this.initialized = true;
      const policy =
        policies.find((candidate) => candidate.id === this.requestedPolicyId) ?? policies[0];
      if (policy) this.loadPolicy(policy);
    });
  }

  protected invalid(field: SlaPolicyField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected fieldError(field: SlaPolicyField): string {
    const control = this.form.controls[field];
    if (control.hasError('required')) return 'Informe os minutos de janela.';
    if (control.hasError('min')) return 'Use um valor maior que zero.';
    return 'Informe um número inteiro de minutos.';
  }

  protected fieldFor(priority: SlaPriority, clock: SlaClock): SlaPolicyField {
    return policyField(priority, clock);
  }

  protected controlId(priority: SlaPriority, clock: SlaClock): string {
    return `sla-${priority}-${clock}`;
  }

  protected windowCopy(priority: SlaPriority, clock: SlaClock): string {
    const value = this.form.controls[this.fieldFor(priority, clock)].value;
    return value && value > 0 ? windowExample(value) : 'Minutos da janela de atendimento.';
  }

  protected formatMinutes(minutes: number): string {
    return new Intl.NumberFormat('pt-BR').format(minutes);
  }

  protected refreshWarnings(): void {
    this.formRevision.update((revision) => revision + 1);
  }

  protected warningLine(priority: SlaPriority): string {
    const times = this.editedMatrix()[priority];
    const label = this.priorities.find((item) => item.key === priority)?.label ?? priority;
    return `${label}: resposta ${this.formatMinutes(times.response)} min, campo ${this.formatMinutes(times.field)} min e resolução ${this.formatMinutes(times.resolution)} min.`;
  }

  protected onPolicyChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    const policy = this.policies().find((candidate) => candidate.id === id);
    if (policy) this.loadPolicy(policy);
    else this.form.controls.name.setValue('');
    this.submitted.set(false);
    this.notice.set(null);
  }

  private loadPolicy(policy: SlaPolicy): void {
    const version = currentPolicyVersion(policy);
    this.form.reset({
      policyId: policy.id,
      name: '',
      defaultPriority: version.defaultPriority,
      altaResponse: version.matrix.alta.response,
      altaField: version.matrix.alta.field,
      altaResolution: version.matrix.alta.resolution,
      normalResponse: version.matrix.normal.response,
      normalField: version.matrix.normal.field,
      normalResolution: version.matrix.normal.resolution,
    });
  }

  protected reviewPreview(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.form.controls.name.updateValueAndValidity();
    if (this.form.controls.name.invalid) {
      this.document.getElementById('sla-edit-name')?.focus();
      return;
    }
    if (this.form.invalid) {
      const field = firstInvalidPolicyField(this.form);
      if (field)
        this.document
          .getElementById(`sla-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`)
          ?.focus();
      return;
    }
    // O backend recusa prazos fora de ordem (ORDEM_PRAZOS_INVALIDA); o aviso já está na tela.
    if (this.warningPriorities().length) {
      this.document.getElementById('sla-order-warning')?.focus();
      return;
    }
    this.trigger = this.reviewButton()?.nativeElement;
    this.completingPreview = false;
    afterNextRender(
      () => {
        if (this.reviewDialog().nativeElement.open) return;
        this.reviewDialog().nativeElement.showModal();
        this.cancelReviewButton()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected save(): void {
    if (this.busy()) return;
    const { policyId, name, defaultPriority } = this.form.getRawValue();
    const prazos = prazosFromMatrix(this.editedMatrix());
    const request: Observable<{ id: string }> = this.isNew()
      ? this.api.criarPolitica(name.trim(), defaultPriority, prazos)
      : this.api.novaVersao(policyId, defaultPriority, prazos);
    const policyName = this.isNew() ? name.trim() : (this.selectedPolicy()?.name ?? '');
    this.busy.set(true);
    request.subscribe({
      next: (created) => {
        this.busy.set(false);
        this.notice.set({
          tone: 'success',
          text: this.isNew()
            ? `Política "${policyName}" criada. Ela já pode ser vinculada a contratos.`
            : `Nova versão de "${policyName}" criada. Chamados novos já usam esses prazos.`,
        });
        if (this.isNew()) this.form.controls.policyId.setValue(created.id);
        this.data.reload();
        this.finishReview();
      },
      error: (erro: unknown) => {
        this.busy.set(false);
        this.notice.set({ tone: 'error', text: mensagemErro(erro) });
        this.finishReview();
      },
    });
  }

  private finishReview(): void {
    this.completingPreview = true;
    this.closeReview();
    afterNextRender(() => this.previewFeedback()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }

  protected closeReview(): void {
    if (this.reviewDialog().nativeElement.open) this.reviewDialog().nativeElement.close();
  }

  protected onReviewClose(): void {
    if (!this.completingPreview) this.trigger?.focus();
    this.trigger = undefined;
    this.completingPreview = false;
  }

  protected onReviewBackdrop(event: MouseEvent): void {
    const dialog = this.reviewDialog().nativeElement;
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      this.closeReview();
    }
  }

  protected trapReviewFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const elements = [
      ...this.reviewDialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = this.document.activeElement;
    if ((event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }
}
