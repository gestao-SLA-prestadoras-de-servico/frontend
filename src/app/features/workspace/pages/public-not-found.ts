import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Brand } from '@app/shared/ui/brand/brand';
import { MissingPage } from '../components/missing-page/missing-page';

@Component({
  selector: 'app-public-not-found',
  imports: [Brand, MissingPage],
  template: `<div class="flex min-h-svh flex-col bg-bg px-5 sm:px-10">
    <header class="py-5"><app-brand /></header>
    <main class="grid grow place-items-center">
      <app-missing-page home="/" label="Voltar ao site" />
    </main>
    <footer class="pb-6 text-center text-xs text-ink3">NIVELO · Projeto Integrador 2026.2</footer>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class PublicNotFound {}
