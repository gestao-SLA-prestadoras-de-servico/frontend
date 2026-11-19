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
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Contrato } from '@app/core/api/modelos';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { mensagemErro } from '@app/core/api/erros';
import { Company, toCompany } from '../data/company-store';
import { Contract, ContractStore, toContract } from '../data/contract-store';
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
  private readonly store = inject(ContractStore);
  private readonly api = inject(CadastroApi);
  private readonly reviewDialog = viewChild.required<ElementRef<HTMLDialogElement>>('reviewDialog');
  private readonly cancelReviewButton =
    viewChild<ElementRef<HTMLButtonElement>>('cancelReviewButton');
  private readonly successMessage = viewChild<ElementRef<HTMLElement>>('successMessage');
  private readonly reviewButton = viewChild<ElementRef<HTMLButtonElement>>('reviewButton');
  private trigger?: HTMLButtonElement;
  private completing = false;
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly options = rxResource({
    stream: () =>
      forkJoin({
        clientes: this.api.clientes({ ativo: true, sort: 'razaoSocial,asc' }),
        politicas: this.api.politicas(),
      }).pipe(
        map(({ clientes, politicas }) => ({
          companies: clientes.map(toCompany),
          policies: politicas.map((p) => ({
            id: p.id,
            name: `${p.nome} · v${p.versaoAtual.numero}`,
          })),
        })),
      ),
  });
  protected readonly policies = computed(() => this.options.value()?.policies ?? []);
  protected readonly activeCompanies = computed(() => this.options.value()?.companies ?? []);
  protected readonly busy = signal(false);
  /**
   * Contrato já criado cujo vínculo com a política falhou. Uma nova confirmação só tenta o
   * vínculo de novo: recriar daria CODIGO_CONTRATO_JA_EXISTE.
   */
  protected readonly pending = signal<Contrato | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly form = createContractForm();
  protected readonly ready = signal(false);
  protected readonly submitted = signal(false);
  protected readonly created = signal<Contract | null>(null);
  protected readonly fieldErrors = CONTRACT_FIELD_ERRORS;
  private readonly companyId = toSignal(this.form.controls.companyId.valueChanges, {
    initialValue: this.form.controls.companyId.value,
  });
  private readonly policyId = toSignal(this.form.controls.policyId.valueChanges, {
    initialValue: this.form.controls.policyId.value,
  });
  protected readonly selectedCompany = computed<Company | undefined>(() =>
    this.activeCompanies().find((company) => String(company.id) === this.companyId()),
  );
  protected readonly selectedPolicy = computed(() =>
    this.policies().find((policy) => policy.id === this.policyId()),
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

  /** O backend cria o contrato sem política; o vínculo é uma segunda chamada. */
  protected confirmDraft(): void {
    if (this.form.invalid || !this.selectedCompany() || !this.selectedPolicy() || this.busy())
      return;
    const raw = this.form.getRawValue();
    this.busy.set(true);
    this.saveError.set(null);
    const pending = this.pending();
    const contrato$: Observable<Contrato> = pending
      ? of(pending)
      : this.api
          .criarContrato({
            clienteId: raw.companyId,
            codigo: raw.code.trim(),
            inicioVigencia: raw.startDate,
            fimVigencia: raw.endDate,
          })
          .pipe(tap((contrato) => this.holdPending(contrato)));
    contrato$
      .pipe(switchMap((contrato) => this.api.vincularPolitica(contrato.id, raw.policyId)))
      .subscribe({
        next: (contrato) => {
          const contract = toContract(contrato);
          this.busy.set(false);
          this.pending.set(null);
          this.store.setNotice({
            title: 'Contrato cadastrado',
            detail: `${contract.code} já aceita chamados durante a vigência.`,
          });
          this.created.set(contract);
          this.completing = true;
          this.closeReview();
          afterNextRender(() => this.successMessage()?.nativeElement.focus(), {
            injector: this.injector,
          });
        },
        error: (erro: unknown) => {
          this.busy.set(false);
          const criado = this.pending();
          this.saveError.set(
            criado
              ? `O contrato ${criado.codigo} foi criado, mas a política não foi vinculada: ${mensagemErro(erro)} Confirme de novo para tentar só o vínculo.`
              : mensagemErro(erro),
          );
        },
      });
  }

  /** Depois de criado, só a política pode mudar: os demais campos já estão no backend. */
  private holdPending(contrato: Contrato): void {
    this.pending.set(contrato);
    for (const field of ['code', 'companyId', 'startDate', 'endDate'] as const)
      this.form.controls[field].disable();
  }
}
