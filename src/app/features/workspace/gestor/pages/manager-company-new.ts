import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerPanel,
  ManagerSectionHeading,
  ManagerLabel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
import { Textarea } from '@app/shared/ui/input/textarea.directive';
import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { Input } from '@app/shared/ui/input/input.directive';
import { CompanyDemoStore, DemoCompany } from '../data/company-demo-store';
import {
  COMPANY_FIELD_ERRORS,
  CompanyField,
  createCompanyForm,
  firstInvalidCompanyField,
} from '../data/company-form';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';

@Component({
  selector: 'app-manager-company-new',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonPrimary,
    ButtonSecondary,
    Input,
    LucideDynamicIcon,
    Textarea,
    ManagerPanel,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerTextAction,
    ManagerPageHeader,
  ],
  templateUrl: './manager-company-new.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerCompanyNew {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly store = inject(CompanyDemoStore);
  private readonly successMessage = viewChild<ElementRef<HTMLElement>>('successMessage');
  private readonly errorMessage = viewChild<ElementRef<HTMLElement>>('errorMessage');
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly form = createCompanyForm();
  protected readonly ready = signal(false);
  protected readonly submitted = signal(false);
  protected readonly simulatedError = signal(false);
  protected readonly created = signal<DemoCompany | null>(null);
  protected readonly fieldErrors = COMPANY_FIELD_ERRORS;

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  protected invalid(field: CompanyField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected clearSimulatedError(): void {
    if (this.simulatedError()) this.simulatedError.set(false);
  }

  protected simulateError(): void {
    this.simulatedError.set(true);
    afterNextRender(() => this.errorMessage()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }

  protected submit(): void {
    if (!this.ready() || this.created()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const field = firstInvalidCompanyField(this.form);
      if (field) this.document.getElementById(`new-company-${field}`)?.focus();
      return;
    }

    const company = this.store.add(this.form.getRawValue());
    this.store.setNotice({
      tone: 'success',
      title: 'Cadastro demonstrativo concluído',
      detail: 'A empresa entrou na lista desta sessão. Nenhuma informação foi enviada ou salva.',
    });
    this.created.set(company);
    this.simulatedError.set(false);
    afterNextRender(() => this.successMessage()?.nativeElement.focus(), {
      injector: this.injector,
    });
  }

  protected startAnother(): void {
    this.form.reset({ legalName: '', contactEmail: '', address: '' });
    this.submitted.set(false);
    this.simulatedError.set(false);
    this.created.set(null);
    afterNextRender(() => this.document.getElementById('new-company-legalName')?.focus(), {
      injector: this.injector,
    });
  }
}
