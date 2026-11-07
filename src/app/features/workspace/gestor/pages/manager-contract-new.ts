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
import { DOCUMENT, DatePipe } from '@angular/common';
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
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { preventDefaultUnlessReplayed } from '../../../../shared/utils/event-replay';
import { CompanyDemoStore, DemoCompany } from '../data/company-demo-store';
import {
  CONTRACT_POLICIES,
  ContractDemoStore,
  ContractDraft,
  DemoContract,
} from '../data/contract-demo-store';
import {
  CONTRACT_FIELD_ERRORS,
  ContractField,
  createContractForm,
  firstInvalidContractField,
} from '../data/contract-form';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';

@Component({
  selector: 'app-manager-contract-new',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonPrimary,
    ButtonSecondary,
    DatePipe,
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
  templateUrl: './manager-contract-new.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerContractNew {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly companiesStore = inject(CompanyDemoStore);
  private readonly store = inject(ContractDemoStore);
  private readonly reviewDialog = viewChild.required<ElementRef<HTMLDialogElement>>('reviewDialog');
  private readonly cancelReviewButton =
    viewChild<ElementRef<HTMLButtonElement>>('cancelReviewButton');
  private readonly successMessage = viewChild<ElementRef<HTMLElement>>('successMessage');
  private readonly reviewButton = viewChild<ElementRef<HTMLButtonElement>>('reviewButton');
  private trigger?: HTMLButtonElement;
  private completing = false;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly policies = CONTRACT_POLICIES;
  protected readonly allCompanies = this.companiesStore.companies;
  protected readonly activeCompanies = computed(() =>
    this.allCompanies().filter((company) => company.situation === 'active'),
  );
  protected readonly form = createContractForm();
  protected readonly ready = signal(false);
  protected readonly submitted = signal(false);
  protected readonly created = signal<DemoContract | null>(null);
  protected readonly fieldErrors = CONTRACT_FIELD_ERRORS;
  private readonly companyId = toSignal(this.form.controls.companyId.valueChanges, {
    initialValue: this.form.controls.companyId.value,
  });
  private readonly policyId = toSignal(this.form.controls.policyId.valueChanges, {
    initialValue: this.form.controls.policyId.value,
  });
  protected readonly selectedCompany = computed<DemoCompany | undefined>(() =>
    this.activeCompanies().find((company) => String(company.id) === this.companyId()),
  );
  protected readonly selectedPolicy = computed(() =>
    this.policies.find((policy) => policy.id === this.policyId()),
  );

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  protected invalid(field: ContractField): boolean {
    const control = this.form.controls[field];
    if (control.invalid && (control.touched || this.submitted())) return true;
    return (
      (field === 'startDate' || field === 'endDate') &&
      this.form.hasError('dateOrder') &&
      this.submitted()
    );
  }

  protected get dateOrderError(): boolean {
    return this.form.hasError('dateOrder') && this.submitted();
  }

  protected openReview(): void {
    if (!this.ready() || this.created()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const field = firstInvalidContractField(this.form);
      if (field) this.document.getElementById('contract-' + field)?.focus();
      return;
    }
    this.trigger = this.reviewButton()?.nativeElement;
    this.completing = false;
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

  protected onReviewClose(): void {
    if (!this.completing) this.trigger?.focus();
    this.trigger = undefined;
    this.completing = false;
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
      ...this.reviewDialog().nativeElement.querySelectorAll<HTMLElement>('button:not([disabled])'),
    ].filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = this.document.activeElement;
    if ((event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
      preventDefaultUnlessReplayed(event);
      (event.shiftKey ? last : first)?.focus();
    }
  }

  protected confirmDraft(): void {
    if (this.form.invalid || !this.selectedCompany() || !this.selectedPolicy()) return;
    const raw = this.form.getRawValue();
    const draft: ContractDraft = {
      companyId: Number(raw.companyId),
      startDate: raw.startDate,
      endDate: raw.endDate,
      policyId: raw.policyId,
    };
    const contract = this.store.add(draft);
    this.store.setNotice({
      title: 'Cadastro demonstrativo concluído',
      detail:
        'O contrato foi incluído somente nesta sessão. Nenhuma informação foi enviada ou salva.',
    });
    this.created.set(contract);
    this.completing = true;
    this.closeReview();
    afterNextRender(() => this.successMessage()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }
}
