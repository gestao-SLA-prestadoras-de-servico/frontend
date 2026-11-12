// Metadados históricos fictícios; não há referência de imagem, arquivo ou URL de storage.
export interface PurgedEvidenceMetadata {
  readonly id: string;
  readonly serviceId: string;
  readonly ticketId: number;
  readonly ticketTitle: string;
  readonly uploadedAt: string;
  readonly uploadedLabel: string;
  readonly purgedAt: string;
  readonly purgedLabel: string;
  readonly reason: string;
}
export const PURGED_EVIDENCE_SAMPLE: PurgedEvidenceMetadata = {
  id: 'EV-4310',
  serviceId: 'AT-2089',
  ticketId: 1032,
  ticketTitle: 'Luminárias do corredor',
  uploadedAt: '2026-04-15T10:20:00-03:00',
  uploadedLabel: '15 abr 2026 às 10h20',
  purgedAt: '2026-10-30T02:00:00-03:00',
  purgedLabel: '30 out 2026 às 02h00',
  reason: 'EXPIRACAO_RETENCAO',
} as const;
