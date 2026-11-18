import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { catchError, from, map, mergeMap, of, toArray } from 'rxjs';
import {
  LucideCamera,
  LucideChevronLeft,
  LucideChevronRight,
  LucideImage,
  LucideUpload,
  LucideX,
} from '@lucide/angular';
import { ChamadosApi } from '@app/core/api/chamados.api';
import { mensagemErro } from '@app/core/api/erros';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { EvidenceImage } from '../../components/evidence-image';
import {
  EVIDENCE_STATE_LABELS,
  EvidenceState,
  evidenceFileError,
  TechnicianEvidence,
} from '../technician-data';

const stateClasses: Record<EvidenceState, string> = {
  RECEBIDA: 'bg-[#e1f4f5] text-[#005b63]',
  PROCESSANDO: 'bg-[#fff1d6] text-[#754500]',
  DISPONIVEL: 'bg-grn-bg text-grn-t',
  FALHA: 'bg-danger-bg text-danger',
  EXPURGADA: 'bg-bg text-ink2',
};

@Component({
  selector: 'app-technician-evidence',
  imports: [
    LucideCamera,
    LucideChevronLeft,
    LucideChevronRight,
    LucideImage,
    LucideUpload,
    LucideX,
    ButtonPrimary,
    ButtonSecondary,
    DatePipe,
    EvidenceImage,
  ],
  templateUrl: './technician-evidence.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TechnicianEvidencePanel {
  readonly ticketId = input.required<string>();
  readonly items = input.required<readonly TechnicianEvidence[]>();
  readonly editable = input(false);
  /** Emitido quando um envio termina: o pai recarrega a lista de evidências. */
  readonly changed = output<void>();

  private readonly api = inject(ChamadosApi);
  protected readonly uploading = signal<readonly string[]>([]);
  protected readonly stateLabels = EVIDENCE_STATE_LABELS;
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

  protected formatSize(bytes: number): string {
    if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
    return `${(bytes / 1_000_000).toFixed(1).replace('.', ',')} MB`;
  }

  protected placeholderLabel(state: EvidenceState): string {
    const labels: Record<EvidenceState, string> = {
      RECEBIDA: 'Imagem recebida · prévia pendente',
      PROCESSANDO: 'Miniatura sendo preparada',
      DISPONIVEL: 'Prévia da imagem',
      FALHA: 'Imagem indisponível por falha',
      EXPURGADA: 'Imagem expurgada',
    };
    return labels[state];
  }

  private addFiles(files: readonly File[]): void {
    if (!files.length || this.uploading().length) return;
    const errors = files.map(evidenceFileError).filter((e): e is string => e !== null);
    const valid = files.filter((file) => !evidenceFileError(file));
    this.errors.set(errors);
    if (!valid.length) {
      this.feedback.set('Nenhuma imagem válida foi enviada.');
      return;
    }
    this.uploading.set(valid.map((file) => file.name));
    const failures: string[] = [];
    from(valid)
      .pipe(
        // Um arquivo recusado não interrompe os demais; até 2 envios em paralelo.
        mergeMap(
          (file) =>
            this.api.enviarEvidencia(this.ticketId(), file).pipe(
              map(() => true),
              catchError((erro: unknown) => {
                failures.push(`${file.name}: ${mensagemErro(erro)}`);
                return of(false);
              }),
            ),
          2,
        ),
        toArray(),
      )
      .subscribe((results) => this.finishUpload(results.filter(Boolean).length, failures));
  }

  private finishUpload(sent: number, errors: readonly string[]): void {
    this.uploading.set([]);
    this.errors.update((current) => [...current, ...errors]);
    this.feedback.set(
      sent
        ? `${sent} ${sent === 1 ? 'imagem enviada' : 'imagens enviadas'}. O processamento leva alguns segundos.`
        : 'Nenhuma imagem foi enviada.',
    );
    this.changed.emit();
  }
}
