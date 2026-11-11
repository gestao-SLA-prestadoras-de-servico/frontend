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
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import {
  currentPolicyVersion,
  firstSlaPolicy,
  inconsistentPriorities,
  policyById,
  SLA_CLOCKS,
  SLA_POLICY_DEMOS,
  SLA_PRIORITIES,
  SlaClock,
  SlaPriority,
  windowExample,
} from '../data/sla-policy-demo-data';
import {
  createSlaPolicyForm,
  firstInvalidPolicyField,
  matrixFromSlaPolicyForm,
  policyField,
  SlaPolicyField,
} from '../data/sla-policy-form';

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
  private trigger?: HTMLButtonElement;
  private completingPreview = false;
  private readonly initialPolicyId =
    policyById(this.route.snapshot.queryParamMap.get('policy') ?? '')?.id ?? firstSlaPolicy().id;
  private readonly initialPolicy = policyById(this.initialPolicyId) ?? firstSlaPolicy();

  protected readonly icons = WORKSPACE_ICONS;
  protected readonly policies = SLA_POLICY_DEMOS;
  protected readonly priorities = SLA_PRIORITIES;
  protected readonly clocks = SLA_CLOCKS;
  protected readonly form = createSlaPolicyForm(
    this.initialPolicyId,
    currentPolicyVersion(this.initialPolicy).matrix,
  );
  private readonly formValues = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  protected readonly selectedPolicy = computed(
    () => policyById(this.formValues().policyId ?? this.initialPolicyId) ?? firstSlaPolicy(),
  );
  protected readonly currentVersion = computed(() => currentPolicyVersion(this.selectedPolicy()));
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
  protected readonly previewNotice = signal('');

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
    const policy = policyById((event.target as HTMLSelectElement).value);
    if (!policy) return;
    const version = currentPolicyVersion(policy);
    this.form.reset({
      policyId: policy.id,
      altaResponse: version.matrix.alta.response,
      altaField: version.matrix.alta.field,
      altaResolution: version.matrix.alta.resolution,
      normalResponse: version.matrix.normal.response,
      normalField: version.matrix.normal.field,
      normalResolution: version.matrix.normal.resolution,
    });
    this.submitted.set(false);
    this.previewNotice.set('');
  }

  protected reviewPreview(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const field = firstInvalidPolicyField(this.form);
      if (field)
        this.document
          .getElementById(`sla-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`)
          ?.focus();
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

  protected closeReview(): void {
    if (this.reviewDialog().nativeElement.open) this.reviewDialog().nativeElement.close();
  }

  protected completePreview(): void {
    this.previewNotice.set(
      'Prévia concluída. A política e o histórico permaneceram inalterados nesta demonstração.',
    );
    this.completingPreview = true;
    this.closeReview();
    afterNextRender(() => this.previewFeedback()?.nativeElement.focus(), {
      injector: this.injector,
    });
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
