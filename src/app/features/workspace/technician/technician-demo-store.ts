import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import {
  ALLOWED_EVIDENCE_EXTENSIONS,
  ALLOWED_EVIDENCE_TYPES,
  MAX_EVIDENCE_SIZE_BYTES,
  TECHNICIAN_TICKETS,
  TechnicianEvidence,
  TechnicianTicket,
  evidenceCountsForCompletion,
} from './technician-data';

export interface EvidenceAddResult {
  added: number;
  errors: readonly string[];
}

@Injectable({ providedIn: 'root' })
export class TechnicianDemoStore {
  readonly tickets = signal<readonly TechnicianTicket[]>(
    TECHNICIAN_TICKETS.map((ticket) => ({ ...ticket, evidences: [...ticket.evidences] })),
  );

  private readonly objectUrls = new Set<string>();
  private nextEvidenceId = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.releaseObjectUrls());
  }

  ticket(id: number): TechnicianTicket | undefined {
    return this.tickets().find((ticket) => ticket.id === id);
  }

  start(id: number): boolean {
    const ticket = this.ticket(id);
    if (!ticket || ticket.status !== 'ATRIBUIDO') return false;
    this.updateTicket(id, (current) => ({
      ...current,
      status: 'EM_ATENDIMENTO',
      events: current.events.map((event) =>
        event.state === 'current'
          ? { ...event, label: 'Atendimento iniciado', at: 'Agora · demonstração' }
          : event,
      ),
    }));
    return true;
  }

  saveDescription(id: number, technicalDescription: string): void {
    this.updateTicket(id, (ticket) => ({ ...ticket, technicalDescription }));
  }

  addEvidenceFiles(id: number, files: readonly File[]): EvidenceAddResult {
    const added: TechnicianEvidence[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
      const supportedType = file.type
        ? (ALLOWED_EVIDENCE_TYPES as readonly string[]).includes(file.type)
        : (ALLOWED_EVIDENCE_EXTENSIONS as readonly string[]).includes(extension);

      if (!supportedType) {
        errors.push(`${file.name}: escolha uma imagem JPEG, PNG ou WebP.`);
        continue;
      }
      if (file.size > MAX_EVIDENCE_SIZE_BYTES) {
        errors.push(`${file.name}: o limite é 10 MB por imagem.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      this.objectUrls.add(previewUrl);
      added.push({
        id: `local-evidence-${++this.nextEvidenceId}`,
        name: file.name,
        sizeBytes: file.size,
        state: 'RECEBIDA',
        source: 'local',
        alt: `Prévia local de ${file.name}`,
        previewUrl,
        recordedAt: 'Selecionada neste dispositivo',
      });
    }

    if (added.length) {
      this.updateTicket(id, (ticket) => ({
        ...ticket,
        evidences: [...ticket.evidences, ...added],
      }));
    }
    return { added: added.length, errors };
  }

  removeLocalEvidence(ticketId: number, evidenceId: string): void {
    const evidence = this.ticket(ticketId)?.evidences.find((item) => item.id === evidenceId);
    if (!evidence || evidence.source !== 'local') return;
    if (evidence.previewUrl) this.revokeObjectUrl(evidence.previewUrl);
    this.updateTicket(ticketId, (ticket) => ({
      ...ticket,
      evidences: ticket.evidences.filter((item) => item.id !== evidenceId),
    }));
  }

  canComplete(id: number): boolean {
    const ticket = this.ticket(id);
    return (
      !!ticket &&
      ticket.status === 'EM_ATENDIMENTO' &&
      ticket.evidences.some(evidenceCountsForCompletion)
    );
  }

  complete(id: number): boolean {
    if (!this.canComplete(id)) return false;
    this.updateTicket(id, (ticket) => ({
      ...ticket,
      status: 'RESOLVIDO',
      events: ticket.events
        .map((event) => ({
          ...event,
          ...(event.state === 'current'
            ? { state: 'done' as const, at: 'Agora · demonstração' }
            : {}),
        }))
        .concat({
          label: 'Atendimento concluído · exemplo demonstrativo',
          at: 'Agora · demonstração',
          state: 'current',
        }),
    }));
    return true;
  }

  private updateTicket(id: number, update: (ticket: TechnicianTicket) => TechnicianTicket): void {
    this.tickets.update((tickets) =>
      tickets.map((ticket) => (ticket.id === id ? update(ticket) : ticket)),
    );
  }

  private revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url);
    this.objectUrls.delete(url);
  }

  private releaseObjectUrls(): void {
    for (const url of this.objectUrls) URL.revokeObjectURL(url);
    this.objectUrls.clear();
  }
}
