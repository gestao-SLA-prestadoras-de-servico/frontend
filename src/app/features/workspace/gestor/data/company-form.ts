import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export type CompanyField = 'legalName' | 'contactEmail' | 'address';

export type CompanyForm = FormGroup<{
  legalName: FormControl<string>;
  contactEmail: FormControl<string>;
  address: FormControl<string>;
}>;

const trimmedLength =
  (min: number, max: number): ValidatorFn =>
  (control) => {
    const length = String(control.value ?? '').trim().length;
    return length >= min && length <= max ? null : { trimmedLength: true };
  };

export function createCompanyForm(): CompanyForm {
  return new FormGroup({
    legalName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, trimmedLength(3, 160)],
    }),
    contactEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(160)],
    }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, trimmedLength(8, 240)],
    }),
  });
}

export const COMPANY_FIELD_ERRORS: Record<CompanyField, string> = {
  legalName: 'Informe uma razão social entre 3 e 160 caracteres.',
  contactEmail: 'Informe um e-mail válido com até 160 caracteres.',
  address: 'Informe um endereço entre 8 e 240 caracteres.',
};

export function firstInvalidCompanyField(form: CompanyForm): CompanyField | undefined {
  return (['legalName', 'contactEmail', 'address'] as const).find(
    (field) => form.controls[field].invalid,
  );
}
