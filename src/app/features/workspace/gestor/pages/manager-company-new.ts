import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerPanel,
  ManagerSectionHeading,
  ManagerLabel,
  ManagerTextAction,
} from '../components/manager-surface.directive';
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
import { CadastroApi } from '@app/core/api/cadastro.api';
import { mensagemErro } from '@app/core/api/erros';
import { Company, CompanyStore, toCompany } from '../data/company-store';
import {
  COMPANY_FIELD_ERRORS,
  companyFormValue,
  createCompanyForm,
  firstInvalidCompanyField,
  toDadosCliente,
} from '../data/company-form';
import { ManagerAddressFields } from '../components/manager-address-fields';
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
    ManagerAddressFields,
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
  private readonly store = inject(CompanyStore);
  private readonly api = inject(CadastroApi);
  private readonly successMessage = viewChild<ElementRef<HTMLElement>>('successMessage');
  private readonly errorMessage = viewChild<ElementRef<HTMLElement>>('errorMessage');
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly form = createCompanyForm();
  protected readonly ready = signal(false);
  protected readonly submitted = signal(false);
  protected readonly busy = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly created = signal<Company | null>(null);
  protected readonly fieldErrors = COMPANY_FIELD_ERRORS;

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  protected invalid(field: 'legalName' | 'contactEmail'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected clearSaveError(): void {
    if (this.saveError()) this.saveError.set(null);
  }

  protected submit(): void {
    if (!this.ready() || this.created() || this.busy()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const field = firstInvalidCompanyField(this.form);
      if (field) this.document.getElementById(`new-company-${field}`)?.focus();
      return;
    }

    this.busy.set(true);
    this.saveError.set(null);
    this.api.criarCliente(toDadosCliente(this.form)).subscribe({
      next: (cliente) => {
        const company = toCompany(cliente);
        this.busy.set(false);
        this.store.setNotice({
          tone: 'success',
          title: 'Empresa cadastrada',
          detail: `${company.legalName} já pode receber contratos e usuários.`,
        });
        this.created.set(company);
        afterNextRender(() => this.successMessage()?.nativeElement.focus(), {
          injector: this.injector,
        });
      },
      error: (erro: unknown) => {
        this.busy.set(false);
        this.saveError.set(mensagemErro(erro));
        afterNextRender(() => this.errorMessage()?.nativeElement.focus(), {
          injector: this.injector,
        });
      },
    });
  }

  protected startAnother(): void {
    this.form.reset(companyFormValue(null));
    this.submitted.set(false);
    this.saveError.set(null);
    this.created.set(null);
    afterNextRender(() => this.document.getElementById('new-company-legalName')?.focus(), {
      injector: this.injector,
    });
  }
}
