import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  LucideCamera,
  LucideChevronLeft,
  LucideChevronRight,
  LucideImage,
  LucideTrash2,
  LucideUpload,
  LucideX,
} from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { EvidenceState, TechnicianEvidence } from '../technician-data';
import { TechnicianDemoStore } from '../technician-demo-store';

const stateClasses: Record<EvidenceState, string> = {
  RECEBIDA: 'bg-[#e1f4f5] text-[#005b63]',
  PROCESSANDO: 'bg-[#fff1d6] text-[#754500]',
  DISPONÍVEL: 'bg-grn-bg text-grn-t',
  FALHA: 'bg-danger-bg text-danger',
  INDISPONÍVEL: 'bg-bg text-ink2',
  EXPURGADA: 'bg-bg text-ink2',
};

@Component({
  selector: 'app-technician-evidence',
  imports: [
    LucideCamera,
    LucideChevronLeft,
    LucideChevronRight,
    LucideImage,
    LucideTrash2,
    LucideUpload,
    LucideX,
    ButtonPrimary,
    ButtonSecondary,
  ],
  templateUrl: './technician-evidence.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TechnicianEvidencePanel {
  readonly ticketId = input.required<number>();
  readonly items = input.required<readonly TechnicianEvidence[]>();
  readonly editable = input(false);

  protected readonly store = inject(TechnicianDemoStore);
  protected readonly feedback = signal('');
  protected readonly errors = signal<readonly string[]>([]);
  protected readonly selectedIndex = signal(0);
  protected readonly currentEvidence = computed(() => this.items()[this.selectedIndex()] ?? null);

  private readonly cameraInput = viewChild.required<ElementRef<HTMLInputElement>>('cameraInput');
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private readonly previewDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('previewDialog');
  private activeTrigger: HTMLElement | null = null;

  protected readonly stateClasses = stateClasses;

  protected openCamera(): void {
    if (this.editable()) this.cameraInput().nativeElement.click();
  }

  protected openFilePicker(): void {
    if (this.editable()) this.fileInput().nativeElement.click();
  }

  protected onSelectedFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    if (!this.editable()) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  protected onDrop(event: DragEvent): void {
    if (!this.editable()) return;
    event.preventDefault();
    this.addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  protected onDropzoneKeydown(event: KeyboardEvent): void {
    if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' '))
      return;
    event.preventDefault();
    this.openFilePicker();
  }

  protected openPreview(index: number, event: MouseEvent): void {
    this.selectedIndex.set(index);
    this.activeTrigger = event.currentTarget as HTMLElement;
    this.previewDialog().nativeElement.showModal();
  }

  protected closePreview(): void {
    this.previewDialog().nativeElement.close();
  }

  protected onPreviewClose(): void {
    if (this.activeTrigger?.isConnected) this.activeTrigger.focus();
    this.activeTrigger = null;
  }

  protected onPreviewKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    this.movePreview(event.key === 'ArrowRight' ? 1 : -1);
  }

  protected movePreview(direction: number): void {
    const length = this.items().length;
    if (length < 2) return;
    this.selectedIndex.update((index) => (index + direction + length) % length);
  }

  protected removeEvidence(evidence: TechnicianEvidence): void {
    this.store.removeLocalEvidence(this.ticketId(), evidence.id);
    this.selectedIndex.set(Math.max(0, Math.min(this.selectedIndex(), this.items().length - 1)));
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
    return `${(bytes / 1_000_000).toFixed(1).replace('.', ',')} MB`;
  }

  protected placeholderLabel(state: EvidenceState): string {
    const labels: Record<EvidenceState, string> = {
      RECEBIDA: 'Imagem recebida · prévia pendente',
      PROCESSANDO: 'Miniatura sendo preparada',
      DISPONÍVEL: 'Prévia da imagem',
      FALHA: 'Imagem indisponível por falha',
      INDISPONÍVEL: 'Imagem indisponível',
      EXPURGADA: 'Imagem expurgada',
    };
    return labels[state];
  }

  private addFiles(files: readonly File[]): void {
    if (!files.length) return;
    const result = this.store.addEvidenceFiles(this.ticketId(), files);
    this.errors.set(result.errors);
    this.feedback.set(
      result.added
        ? `${result.added} ${result.added === 1 ? 'imagem adicionada' : 'imagens adicionadas'} como prévia local. Nada foi enviado.`
        : 'Nenhuma imagem válida foi adicionada.',
    );
  }
}
