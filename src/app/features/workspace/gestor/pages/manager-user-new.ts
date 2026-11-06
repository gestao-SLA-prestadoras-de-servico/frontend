import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { Input } from '@app/shared/ui/input/input.directive';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { WORKSPACE_ICONS } from '../../data/workspace-icons';
import { ManagerUserRole, UserDemoStore } from '../data/user-demo-store';

type UserForm = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<ManagerUserRole>;
  company: FormControl<string>;
}>;

@Component({
  selector: 'app-manager-user-new',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonPrimary,
    ButtonSecondary,
    Input,
    PageHeading,
    LucideDynamicIcon,
  ],
  templateUrl: './manager-user-new.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerUserNew {
  private readonly router = inject(Router);
  private readonly store = inject(UserDemoStore);
  private readonly document = inject(DOCUMENT);
  protected readonly icons = WORKSPACE_ICONS;
  protected readonly submitted = signal(false);
  protected readonly form: UserForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(160)],
    }),
    role: new FormControl<ManagerUserRole>('Cliente', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    company: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  protected readonly isClient = signal(true);
  protected readonly errors = {
    name: 'Informe um nome entre 3 e 100 caracteres.',
    email: 'Informe um e-mail válido com até 160 caracteres.',
    company: 'Selecione a empresa vinculada ao perfil Cliente.',
  };

  constructor() {
    this.form.controls.role.valueChanges.subscribe((role) => {
      this.isClient.set(role === 'Cliente');
      if (role === 'Cliente') this.form.controls.company.addValidators(Validators.required);
      else this.form.controls.company.clearValidators();
      this.form.controls.company.updateValueAndValidity();
    });
  }

  protected invalid(field: keyof UserForm['controls']): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const fields: ('name' | 'email' | 'company')[] = this.isClient()
        ? ['name', 'email', 'company']
        : ['name', 'email'];
      const first = fields.find((field) => this.form.controls[field].invalid);
      this.document.getElementById(`new-user-${first ?? 'name'}`)?.focus();
      return;
    }
    const values = this.form.getRawValue();
    const created = this.store.add({
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
      company: values.role === 'Cliente' ? values.company : undefined,
    });
    if (!created) {
      this.form.controls.email.setErrors({ duplicate: true });
      this.document.getElementById('new-user-email')?.focus();
      return;
    }
    this.store.setNotice({
      tone: 'success',
      title: 'Cadastro demonstrativo concluído',
      detail: `${created.name} foi adicionado(a) apenas à lista desta sessão. Nenhuma conta foi criada no Keycloak.`,
    });
    void this.router.navigateByUrl('/app/gestor/usuarios');
  }
}
