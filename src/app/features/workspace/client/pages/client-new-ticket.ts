import { DatePipe, DOCUMENT } from '@angular/common';
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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LucideDynamicIcon } from '@lucide/angular';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro } from '@app/core/api/erros';
import { ChamadoCliente, Prioridade } from '@app/core/api/modelos';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { CLIENT_PRIORITIES, ClientPriority } from '../data/client-data';

const PRIORIDADE: Record<ClientPriority, Prioridade> = { Normal: 'NORMAL', Alta: 'ALTA' };

const trimmedLength =
  (min: number, max: number): ValidatorFn =>
  (control) => {
    const length = String(control.value ?? '').trim().length;
    return length >= min && length <= max ? null : { trimmedLength: true };
  };
type TicketField = 'contract' | 'title' | 'description' | 'location' | 'priority';

@Component({
  selector: 'app-client-new-ticket',
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    ButtonPrimary,
    ButtonSecondary,
    PageHeading,
    LucideDynamicIcon,
  ],
  templateUrl: './client-new-ticket.html',
  styleUrl: '../client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientNewTicket {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly api = inject(ChamadosApi);
  private readonly confirmation = viewChild<ElementRef<HTMLElement>>('confirmation');
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly priorities = CLIENT_PRIORITIES;
  /** /api/me/contratos já devolve só os vigentes; sem política o backend recusa a abertura. */
  protected readonly contractsData = rxResource({
    stream: () =>
      this.api.meusContratos().pipe(
        map((contratos) =>
          contratos.map((c) => ({
            id: c.id,
            code: c.codigo,
            until: c.fimVigencia,
            available: c.politicaId !== null,
          })),
        ),
      ),
  });
  protected readonly contracts = computed(() => this.contractsData.value() ?? []);
  protected readonly ready = signal(false);
  protected readonly submitted = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly created = signal<ChamadoCliente | null>(null);
  protected readonly success = computed(() => this.created() !== null);
  protected readonly form = new FormGroup({
    contract: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        (control) =>
          !control.value ||
          this.contracts().some((contract) => contract.id === control.value && contract.available)
            ? null
            : { unavailable: true },
      ],
    }),
    title: new FormControl('', { nonNullable: true, validators: [trimmedLength(5, 120)] }),
    description: new FormControl('', { nonNullable: true, validators: [trimmedLength(20, 2000)] }),
    location: new FormControl('', { nonNullable: true, validators: [trimmedLength(3, 160)] }),
    priority: new FormControl('Normal', {
      nonNullable: true,
      validators: [
        (control) =>
          CLIENT_PRIORITIES.some((priority) => priority === control.value)
            ? null
            : { priority: true },
      ],
    }),
  });
  private readonly contractId = toSignal(this.form.controls.contract.valueChanges, {
    initialValue: this.form.controls.contract.value,
  });
  protected readonly selectedContract = computed(() =>
    this.contracts().find((contract) => contract.id === this.contractId()),
  );
  protected readonly fieldErrors: Record<TicketField, string> = {
    contract: 'Selecione um contrato vigente com política de SLA.',
    title: 'Informe um título de 5 a 120 caracteres.',
    description: 'Descreva o problema usando de 20 a 2.000 caracteres.',
    location: 'Informe o local usando de 3 a 160 caracteres.',
    priority: 'Selecione uma das prioridades sugeridas.',
  };

  constructor() {
    afterNextRender(() => this.ready.set(true));
    // Pré-seleciona o primeiro contrato disponível assim que a lista chega.
    effect(() => {
      const first = this.contracts().find((c) => c.available);
      const control = this.form.controls.contract;
      if (first && !control.value) control.setValue(first.id);
    });
  }
  protected invalid(field: TicketField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }
  protected submit(): void {
    if (!this.ready() || this.success() || this.busy()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const field = (Object.keys(this.form.controls) as TicketField[]).find(
        (key) => this.form.controls[key].invalid,
      );
      this.document.getElementById(`new-${field}`)?.focus();
      return;
    }
    const { contract, title, description, location, priority } = this.form.getRawValue();
    this.busy.set(true);
    this.error.set(null);
    this.api
      .abrir({
        contratoId: contract,
        titulo: title.trim(),
        descricao: description.trim(),
        local: location.trim(),
        prioridadeSugerida: PRIORIDADE[priority as ClientPriority],
      })
      .subscribe({
        next: (chamado) => {
          this.busy.set(false);
          this.created.set(chamado);
          afterNextRender(() => this.confirmation()?.nativeElement.focus(), {
            injector: this.injector,
          });
        },
        error: (erro: unknown) => {
          this.busy.set(false);
          this.error.set(mensagemErro(erro));
        },
      });
  }
  protected startAnother(): void {
    this.form.reset({
      contract: this.contracts().find((c) => c.available)?.id ?? '',
      title: '',
      description: '',
      location: '',
      priority: 'Normal',
    });
    this.submitted.set(false);
    this.created.set(null);
    afterNextRender(() => this.document.getElementById('new-title')?.focus(), {
      injector: this.injector,
    });
  }
}
