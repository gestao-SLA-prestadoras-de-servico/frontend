import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ChamadosApi } from '@app/core/api/chamados.api';

/** Imagem de evidência buscada com o Bearer e exibida por object URL (revogada ao trocar ou destruir). */
@Component({
  selector: 'app-evidence-image',
  template: `@if (src.value(); as url) {
      <img [src]="url" [alt]="alt()" [class]="imgClass()" loading="lazy" />
    } @else if (src.error()) {
      <p class="text-sm text-ink2">Não foi possível carregar a imagem.</p>
    } @else {
      <div [class]="imgClass()" class="animate-pulse bg-bg" aria-hidden="true"></div>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class EvidenceImage {
  private readonly api = inject(ChamadosApi);
  readonly evidenceId = input.required<string>();
  readonly alt = input.required<string>();
  readonly variant = input<'visualizacao' | 'miniatura'>('visualizacao');
  readonly imgClass = input('aspect-[16/9] w-full rounded-sm object-cover');
  private readonly current = signal<string | null>(null);

  protected readonly src = rxResource({
    params: () => ({ id: this.evidenceId(), variante: this.variant() }),
    stream: ({ params }) =>
      this.api.conteudoEvidencia(params.id, params.variante).pipe(map((blob) => this.swap(blob))),
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.swap(null));
  }

  private swap(blob: Blob | null): string | null {
    const old = this.current();
    if (old) URL.revokeObjectURL(old);
    const url = blob ? URL.createObjectURL(blob) : null;
    this.current.set(url);
    return url;
  }
}

/**
 * Baixa o arquivo original da evidência. O download precisa do Bearer, então busca o blob e
 * aciona um link temporário.
 */
@Component({
  selector: 'app-evidence-download',
  template: `<button
      type="button"
      class="inline-flex min-h-11 items-center text-xs font-semibold text-pri-d underline underline-offset-4 hover:text-pri disabled:cursor-wait disabled:opacity-60"
      [disabled]="busy()"
      (click)="download()"
    >
      {{ busy() ? 'Baixando…' : 'Baixar original' }}
    </button>
    @if (error()) {
      <span class="ml-2 text-xs text-danger" role="alert">Falha ao baixar.</span>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center' },
})
export class EvidenceDownload {
  private readonly api = inject(ChamadosApi);
  readonly evidenceId = input.required<string>();
  readonly fileName = input.required<string>();
  protected readonly busy = signal(false);
  protected readonly error = signal(false);

  protected download(): void {
    this.busy.set(true);
    this.error.set(false);
    this.api.conteudoEvidencia(this.evidenceId(), 'original').subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = Object.assign(document.createElement('a'), {
          href: url,
          download: this.fileName(),
        });
        link.click();
        setTimeout(() => URL.revokeObjectURL(url));
        this.busy.set(false);
      },
      error: () => {
        this.busy.set(false);
        this.error.set(true);
      },
    });
  }
}
