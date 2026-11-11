import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SlaPriority, SlaTimeMatrix } from './sla-policy-demo-data';

export type SlaPolicyForm = FormGroup<{
  policyId: FormControl<string>;
  altaResponse: FormControl<number | null>;
  altaField: FormControl<number | null>;
  altaResolution: FormControl<number | null>;
  normalResponse: FormControl<number | null>;
  normalField: FormControl<number | null>;
  normalResolution: FormControl<number | null>;
}>;

export type SlaPolicyField = Exclude<keyof SlaPolicyForm['controls'], 'policyId'>;

export const SLA_POLICY_FIELD_LABELS: Record<SlaPolicyField, string> = {
  altaResponse: 'Informe os minutos de resposta para prioridade Alta.',
  altaField: 'Informe os minutos de atendimento em campo para prioridade Alta.',
  altaResolution: 'Informe os minutos de resolução para prioridade Alta.',
  normalResponse: 'Informe os minutos de resposta para prioridade Normal.',
  normalField: 'Informe os minutos de atendimento em campo para prioridade Normal.',
  normalResolution: 'Informe os minutos de resolução para prioridade Normal.',
};

const positiveWholeMinutes = [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)];

export function createSlaPolicyForm(policyId: string, matrix: SlaTimeMatrix): SlaPolicyForm {
  return new FormGroup({
    policyId: new FormControl(policyId, { nonNullable: true, validators: [Validators.required] }),
    altaResponse: new FormControl(matrix.alta.response, { validators: positiveWholeMinutes }),
    altaField: new FormControl(matrix.alta.field, { validators: positiveWholeMinutes }),
    altaResolution: new FormControl(matrix.alta.resolution, { validators: positiveWholeMinutes }),
    normalResponse: new FormControl(matrix.normal.response, { validators: positiveWholeMinutes }),
    normalField: new FormControl(matrix.normal.field, { validators: positiveWholeMinutes }),
    normalResolution: new FormControl(matrix.normal.resolution, {
      validators: positiveWholeMinutes,
    }),
  });
}

export function matrixFromSlaPolicyForm(form: SlaPolicyForm): SlaTimeMatrix {
  const values = form.getRawValue();
  return {
    alta: {
      response: values.altaResponse ?? 0,
      field: values.altaField ?? 0,
      resolution: values.altaResolution ?? 0,
    },
    normal: {
      response: values.normalResponse ?? 0,
      field: values.normalField ?? 0,
      resolution: values.normalResolution ?? 0,
    },
  };
}

export function policyField(
  priority: SlaPriority,
  clock: 'response' | 'field' | 'resolution',
): SlaPolicyField {
  const priorityPrefix = priority === 'alta' ? 'alta' : 'normal';
  const clockSuffix =
    clock === 'response' ? 'Response' : clock === 'field' ? 'Field' : 'Resolution';
  return (priorityPrefix + clockSuffix) as SlaPolicyField;
}

export function firstInvalidPolicyField(form: SlaPolicyForm): SlaPolicyField | undefined {
  return (
    [
      'altaResponse',
      'altaField',
      'altaResolution',
      'normalResponse',
      'normalField',
      'normalResolution',
    ] as const
  ).find((field) => form.controls[field].invalid);
}
