import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DadosCliente, Endereco } from '@app/core/api/modelos';

export type CompanyField = 'legalName' | 'contactEmail' | AddressField;
export type AddressField = keyof AddressForm['controls'];

export type AddressForm = FormGroup<{
  logradouro: FormControl<string>;
  numero: FormControl<string>;
  complemento: FormControl<string>;
  bairro: FormControl<string>;
  cidade: FormControl<string>;
  uf: FormControl<string>;
  cep: FormControl<string>;
}>;

export type CompanyForm = FormGroup<{
  legalName: FormControl<string>;
  contactEmail: FormControl<string>;
  address: AddressForm;
}>;

const trimmedLength =
  (min: number, max: number): ValidatorFn =>
  (control) => {
    const length = String(control.value ?? '').trim().length;
    return length >= min && length <= max ? null : { trimmedLength: true };
  };

const text = (min: number, max: number) =>
  new FormControl('', { nonNullable: true, validators: [trimmedLength(min, max)] });

/** Limites iguais aos do backend (DadosCliente e Endereco). */
export function createCompanyForm(): CompanyForm {
  return new FormGroup({
    legalName: text(3, 200),
    contactEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    address: new FormGroup({
      logradouro: text(2, 200),
      numero: text(1, 20),
      complemento: new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(100)],
      }),
      bairro: text(2, 100),
      cidade: text(2, 100),
      uf: new FormControl('', {
        nonNullable: true,
        validators: [Validators.pattern(/^\s*[A-Za-z]{2}\s*$/)],
      }),
      cep: new FormControl('', {
        nonNullable: true,
        validators: [Validators.pattern(/^\s*\d{5}-?\d{3}\s*$/)],
      }),
    }),
  });
}

export const COMPANY_FIELD_ERRORS: Record<CompanyField, string> = {
  legalName: 'Informe uma razão social entre 3 e 200 caracteres.',
  contactEmail: 'Informe um e-mail válido.',
  logradouro: 'Informe a rua ou avenida.',
  numero: 'Informe o número (até 20 caracteres).',
  complemento: 'Use até 100 caracteres.',
  bairro: 'Informe o bairro.',
  cidade: 'Informe a cidade.',
  uf: 'Informe a UF com duas letras.',
  cep: 'Informe o CEP com 8 dígitos.',
};

const ADDRESS_FIELDS: readonly AddressField[] = [
  'logradouro',
  'numero',
  'complemento',
  'bairro',
  'cidade',
  'uf',
  'cep',
];

export function firstInvalidCompanyField(form: CompanyForm): CompanyField | undefined {
  if (form.controls.legalName.invalid) return 'legalName';
  if (form.controls.contactEmail.invalid) return 'contactEmail';
  return ADDRESS_FIELDS.find((field) => form.controls.address.controls[field].invalid);
}

export function companyFormValue(endereco: Endereco | null, legalName = '', contactEmail = '') {
  return {
    legalName,
    contactEmail,
    address: {
      logradouro: endereco?.logradouro ?? '',
      numero: endereco?.numero ?? '',
      complemento: endereco?.complemento ?? '',
      bairro: endereco?.bairro ?? '',
      cidade: endereco?.cidade ?? '',
      uf: endereco?.uf ?? '',
      cep: endereco?.cep ?? '',
    },
  };
}

/** Normaliza para o formato do backend: UF maiúscula, CEP só com dígitos, complemento opcional. */
export function toDadosCliente(form: CompanyForm): DadosCliente {
  const { legalName, contactEmail, address: a } = form.getRawValue();
  return {
    razaoSocial: legalName.trim(),
    emailContato: contactEmail.trim(),
    endereco: {
      logradouro: a.logradouro.trim(),
      numero: a.numero.trim(),
      complemento: a.complemento.trim() || null,
      bairro: a.bairro.trim(),
      cidade: a.cidade.trim(),
      uf: a.uf.trim().toUpperCase(),
      cep: a.cep.replace(/\D/g, ''),
    },
  };
}
