import { ManagerPageHeader } from '../components/manager-page-header';
import {
  ManagerPanel,
  ManagerSectionHeading,
  ManagerLabel,
} from '../components/manager-surface.directive';
import { Select } from '@app/shared/ui/input/select.directive';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { Input } from '@app/shared/ui/input/input.directive';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { mensagemErro, problema } from '@app/core/api/erros';
import { UsuariosApi } from '@app/core/api/usuarios.api';
import { ManagerUserRole, ROLE_PAPEL, UserStore } from '../data/user-store';

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

    Select,
    ManagerPanel,
    ManagerSectionHeading,
    ManagerLabel,
    ManagerPageHeader,
  ],
  templateUrl: './manager-user-new.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerUserNew {
  private readonly router = inject(Router);
  private readonly store = inject(UserStore);
  private readonly api = inject(UsuariosApi);
  private readonly cadastro = inject(CadastroApi);
  /** Só empresas ativas aceitam usuários novos (CLIENTE_INATIVO). */
  protected readonly companies = rxResource({
    stream: () =>
      this.cadastro
        .clientes({ ativo: true, sort: 'razaoSocial,asc' })
        .pipe(map((clientes) => clientes.map((c) => ({ id: c.id, name: c.razaoSocial })))),
  });
  protected readonly busy = signal(false);
  protected readonly saveError = signal<string | null>(null);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  protected readonly submitted = signal(false);
  protected readonly form: UserForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    role: new FormControl<ManagerUserRole>('Cliente', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    company: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  protected readonly isClient = signal(true);
  protected readonly errors = {
    name: 'Informe um nome entre 3 e 150 caracteres.',
    email: 'Informe um e-mail válido.',
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
      afterNextRender(() => this.document.getElementById(`new-user-${first ?? 'name'}`)?.focus(), {
        injector: this.injector,
      });
      return;
    }
    if (this.busy()) return;
    const values = this.form.getRawValue();
    this.busy.set(true);
    this.saveError.set(null);
    this.api
      .criar({
        nome: values.name.trim(),
        email: values.email.trim(),
        perfil: ROLE_PAPEL[values.role],
        ...(values.role === 'Cliente' ? { clienteId: values.company } : {}),
      })
      .subscribe({
        next: (created) => {
          this.busy.set(false);
          this.store.setNotice({
            tone: created.emailDefinicaoSenhaEnviado ? 'success' : 'error',
            title: `${created.nome} foi cadastrado(a)`,
            detail: created.emailDefinicaoSenhaEnviado
              ? `Enviamos para ${created.email} o link para definir a senha.`
              : `A conta foi criada, mas o e-mail para definir a senha não foi enviado. Peça ao suporte para reenviar.`,
          });
          void this.router.navigateByUrl('/app/gestor/usuarios');
        },
        error: (erro: unknown) => {
          this.busy.set(false);
          if (problema(erro)?.codigo === 'USUARIO_JA_EXISTE') {
            this.form.controls.email.setErrors({ duplicate: true });
            afterNextRender(() => this.document.getElementById('new-user-email')?.focus(), {
              injector: this.injector,
            });
          } else {
            this.saveError.set(mensagemErro(erro));
          }
        },
      });
  }
}
