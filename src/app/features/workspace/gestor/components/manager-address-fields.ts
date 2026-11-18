import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Input } from '@app/shared/ui/input/input.directive';
import { AddressField, AddressForm, COMPANY_FIELD_ERRORS } from '../data/company-form';

/** Campos de endereço do cliente (Endereco do backend), usados no cadastro e na edição. */
@Component({
  selector: 'app-manager-address-fields',
  imports: [ReactiveFormsModule, Input],
  template: `
    <fieldset class="m-0 min-w-0 border-0 p-0" [formGroup]="group()">
      <legend class="text-sm font-semibold">Endereço</legend>
      <div class="mt-2 grid gap-4 sm:grid-cols-6">
        @for (field of fields; track field.key) {
          <div [class]="field.span">
            <label class="text-xs text-ink2" [for]="prefix() + '-' + field.key">
              {{ field.label }}
            </label>
            <input
              appInput
              class="mt-1"
              [id]="prefix() + '-' + field.key"
              [formControlName]="field.key"
              [attr.autocomplete]="field.autocomplete"
              [attr.inputmode]="field.inputmode"
              [attr.maxlength]="field.max"
              [attr.aria-invalid]="invalid(field.key)"
              [attr.aria-describedby]="prefix() + '-' + field.key + '-error'"
            />
            <p
              class="mt-1 text-sm text-danger"
              [id]="prefix() + '-' + field.key + '-error'"
              [hidden]="!invalid(field.key)"
            >
              {{ errors[field.key] }}
            </p>
          </div>
        }
      </div>
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerAddressFields {
  readonly group = input.required<AddressForm>();
  /** Prefixo dos ids; o foco do primeiro erro usa `<prefix>-<campo>`. */
  readonly prefix = input.required<string>();
  readonly submitted = input(false);
  protected readonly errors = COMPANY_FIELD_ERRORS;
  protected readonly fields: readonly {
    key: AddressField;
    label: string;
    span: string;
    max: number;
    autocomplete?: string;
    inputmode?: string;
  }[] = [
    {
      key: 'logradouro',
      label: 'Rua ou avenida',
      span: 'sm:col-span-4',
      max: 200,
      autocomplete: 'address-line1',
    },
    { key: 'numero', label: 'Número', span: 'sm:col-span-2', max: 20 },
    {
      key: 'complemento',
      label: 'Complemento (opcional)',
      span: 'sm:col-span-3',
      max: 100,
      autocomplete: 'address-line2',
    },
    {
      key: 'bairro',
      label: 'Bairro',
      span: 'sm:col-span-3',
      max: 100,
      autocomplete: 'address-level3',
    },
    {
      key: 'cidade',
      label: 'Cidade',
      span: 'sm:col-span-3',
      max: 100,
      autocomplete: 'address-level2',
    },
    { key: 'uf', label: 'UF', span: 'sm:col-span-1', max: 2, autocomplete: 'address-level1' },
    {
      key: 'cep',
      label: 'CEP',
      span: 'sm:col-span-2',
      max: 9,
      autocomplete: 'postal-code',
      inputmode: 'numeric',
    },
  ];

  protected invalid(field: AddressField): boolean {
    const control = this.group().controls[field];
    return control.invalid && (control.touched || this.submitted());
  }
}
