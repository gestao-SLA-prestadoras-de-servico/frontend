import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export type ContractField = 'companyId' | 'startDate' | 'endDate' | 'policyId';

export type ContractForm = FormGroup<{
  companyId: FormControl<string>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
  policyId: FormControl<string>;
}>;

const chronologicalDates: ValidatorFn = (control) => {
  const startDate = String(control.get('startDate')?.value ?? '');
  const endDate = String(control.get('endDate')?.value ?? '');
  if (!startDate || !endDate) return null;
  return startDate <= endDate ? null : { dateOrder: true };
};

export function createContractForm(): ContractForm {
  return new FormGroup(
    {
      companyId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      startDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      endDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      policyId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: [chronologicalDates] },
  );
}

export const CONTRACT_FIELD_ERRORS: Record<ContractField, string> = {
  companyId: 'Selecione uma empresa ativa.',
  startDate: 'Informe a data de início da vigência.',
  endDate: 'Informe a data final da vigência.',
  policyId: 'Selecione uma política vinculada.',
};

export function firstInvalidContractField(form: ContractForm): ContractField | undefined {
  const field = (['companyId', 'startDate', 'endDate', 'policyId'] as const).find(
    (key) => form.controls[key].invalid,
  );
  if (field) return field;
  return form.hasError('dateOrder') ? 'endDate' : undefined;
}
