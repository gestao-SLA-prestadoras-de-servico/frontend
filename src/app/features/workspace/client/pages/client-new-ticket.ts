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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ClientNotice } from '../components/client-notice';
import { CLIENT_CONTRACTS, CLIENT_PRIORITIES } from '../data/client-data';

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
    RouterLink,
    ReactiveFormsModule,
    ButtonPrimary,
    ButtonSecondary,
    PageHeading,
    LucideDynamicIcon,
    ClientNotice,
  ],
  templateUrl: './client-new-ticket.html',
  styleUrl: '../client.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientNewTicket {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly confirmation = viewChild<ElementRef<HTMLElement>>('confirmation');
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly contracts = CLIENT_CONTRACTS;
  protected readonly priorities = CLIENT_PRIORITIES;
  protected readonly ready = signal(false);
  protected readonly submitted = signal(false);
  protected readonly success = signal(false);
  protected readonly form = new FormGroup({
    contract: new FormControl(this.contracts[0].id, {
      nonNullable: true,
      validators: [
        Validators.required,
        (control) =>
          CLIENT_CONTRACTS.some((contract) => contract.id === control.value && contract.available)
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
    this.contracts.find((contract) => contract.id === this.contractId()),
  );
  protected readonly fieldErrors: Record<TicketField, string> = {
    contract: 'Selecione um contrato vigente para continuar.',
    title: 'Informe um título de 5 a 120 caracteres.',
    description: 'Descreva o problema usando de 20 a 2.000 caracteres.',
    location: 'Informe o local usando de 3 a 160 caracteres.',
    priority: 'Selecione uma das prioridades sugeridas.',
  };

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }
  protected invalid(field: TicketField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }
  protected submit(): void {
    if (!this.ready() || this.success()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const field = (Object.keys(this.form.controls) as TicketField[]).find(
        (key) => this.form.controls[key].invalid,
      );
      this.document.getElementById(`new-${field}`)?.focus();
      return;
    }
    this.success.set(true);
    afterNextRender(() => this.confirmation()?.nativeElement.focus(), { injector: this.injector });
  }
  protected startAnother(): void {
    this.form.reset({
      contract: this.contracts[0].id,
      title: '',
      description: '',
      location: '',
      priority: 'Normal',
    });
    this.submitted.set(false);
    this.success.set(false);
    afterNextRender(() => this.document.getElementById('new-title')?.focus(), {
      injector: this.injector,
    });
  }
}
