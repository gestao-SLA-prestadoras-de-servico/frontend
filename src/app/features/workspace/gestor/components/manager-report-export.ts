import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { LucideDownload, LucideX } from '@lucide/angular';
import { ButtonPrimary, ButtonSecondary } from '@app/shared/ui/button';
import { WorkspaceLoadingState } from '../../components/workspace-loading-state';
import { ManagerDialog } from './manager-surface.directive';

@Component({
  selector: 'app-manager-report-export',
  imports: [
    ButtonPrimary,
    ButtonSecondary,
    LucideDownload,
    LucideX,
    ManagerDialog,
    WorkspaceLoadingState,
  ],
  template: `
    <div
      class="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Exportação demonstrativa"
    >
      @for (format of formats; track format) {
        <button
          appButtonSecondary
          type="button"
          class="min-h-11 px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-45"
          [disabled]="disabled() || busy()"
          [attr.aria-busy]="busy() && selected() === format"
          (click)="open(format, $event)"
        >
          <svg lucideDownload class="size-4" aria-hidden="true"></svg>
          {{
            busy() && selected() === format ? 'Preparando ' + format + '…' : 'Exportar ' + format
          }}
        </button>
      }
    </div>
    <dialog
      #dialog
      appManagerDialog
      tabindex="-1"
      class="w-[min(540px,calc(100%-24px))]"
      aria-labelledby="report-export-title"
      aria-describedby="report-export-context"
      (close)="onClose()"
      (keydown)="trapFocus($event)"
      (click)="onBackdrop($event)"
    >
      <div class="p-5 sm:p-7">
        <div class="flex items-start justify-between gap-3">
          <h2 id="report-export-title" class="pt-2 text-xl font-semibold tracking-[-.02em]">
            Exportação de demonstração
          </h2>
          <button
            #closeButton
            type="button"
            class="grid size-11 shrink-0 place-items-center rounded-lg text-ink2 hover:bg-bg"
            aria-label="Fechar exportação"
            (click)="close()"
          >
            <svg lucideX class="size-5" aria-hidden="true"></svg>
          </button>
        </div>
        <p id="report-export-context" class="mt-3 text-sm leading-relaxed text-ink2">
          {{ selected() }} · {{ context() }}
        </p>
        @if (busy()) {
          <app-workspace-loading-state
            [skeleton]="false"
            [label]="'Preparando ' + selected() + ' de exemplo…'"
          />
          <p class="text-sm leading-relaxed text-ink2">
            Estado de processamento simulado. Nenhum arquivo será gerado e nenhum download será
            iniciado.
          </p>
        } @else {
          <p class="mt-6 rounded-lg bg-grn-bg p-4 text-sm leading-relaxed text-grn-t" role="status">
            Simulação concluída. Nenhum arquivo foi gerado ou baixado.
          </p>
        }
        <div class="mt-6 flex flex-wrap justify-end gap-3">
          <button appButtonSecondary type="button" class="min-h-11 px-4 py-2.5" (click)="close()">
            {{ busy() ? 'Cancelar simulação' : 'Fechar' }}
          </button>
          @if (busy()) {
            <button
              #finishButton
              appButtonPrimary
              type="button"
              class="min-h-11 px-4 py-2.5"
              (click)="finish()"
            >
              Concluir simulação
            </button>
          }
        </div>
      </div>
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ManagerReportExport {
  readonly disabled = input(false);
  readonly context = input.required<string>();
  protected readonly formats = ['PDF', 'CSV'] as const;
  protected readonly selected = signal<'PDF' | 'CSV'>('PDF');
  protected readonly busy = signal(false);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');
  private returnTarget: HTMLElement | null = null;
  private readonly injector = inject(Injector);

  protected open(format: 'PDF' | 'CSV', event: Event): void {
    if (this.disabled() || this.busy()) return;
    this.returnTarget = event.currentTarget as HTMLElement;
    this.selected.set(format);
    this.busy.set(true);
    this.dialog().nativeElement.showModal();
    this.closeButton().nativeElement.focus();
  }
  protected finish(): void {
    this.closeButton().nativeElement.focus();
    this.busy.set(false);
  }
  protected close(): void {
    this.dialog().nativeElement.close();
  }
  protected onClose(): void {
    this.busy.set(false);
    afterNextRender(() => this.returnTarget?.focus(), { injector: this.injector });
  }
  protected onBackdrop(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      this.close();
  }
  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const controls = [
      ...this.dialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]),a[href],select',
      ),
    ];
    const first = controls[0],
      last = controls.at(-1);
    if (event.shiftKey && event.target === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && event.target === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}
