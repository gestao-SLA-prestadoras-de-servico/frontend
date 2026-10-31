import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Icon, IconName } from '../icon/icon';
import { Reveal } from '../../reveal.directive';

@Component({
  selector: 'app-deadline-story',
  imports: [Icon, Reveal],
  templateUrl: './deadline-story.html',
  styleUrl: './deadline-story.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeadlineStory {
  private readonly scene = viewChild.required<ElementRef<HTMLElement>>('scene');
  private readonly progress = viewChild.required<ElementRef<HTMLElement>>('progress');
  private readonly destroyRef = inject(DestroyRef);
  protected readonly stage = signal(0);
  protected readonly steps: {
    icon: IconName;
    title: string;
    subtitle: string;
    description: string;
  }[] = [
    {
      icon: 'file',
      title: 'Resposta',
      subtitle: 'O primeiro retorno',
      description: 'O chamado é recebido e a prestadora dá seu primeiro posicionamento ao cliente.',
    },
    {
      icon: 'truck',
      title: 'Atendimento em campo',
      subtitle: 'O início do serviço',
      description: 'O técnico inicia o atendimento no local, conforme os compromissos do contrato.',
    },
    {
      icon: 'check',
      title: 'Resolução',
      subtitle: 'A solução apresentada',
      description: 'A solução é registrada com as evidências do serviço e segue para validação.',
    },
  ];

  constructor() {
    afterNextRender(() => {
      if (typeof matchMedia === 'undefined' || typeof IntersectionObserver === 'undefined') return;
      const media = matchMedia(
        '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)',
      );
      const scene = this.scene().nativeElement;
      const progress = this.progress().nativeElement;
      let animation: Animation | undefined;
      let frame = 0;
      let inView = false;
      const draw = () => {
        frame = 0;
        if (!media.matches || !inView) return;
        const rect = scene.getBoundingClientRect();
        const distance = Math.max(1, rect.height - window.innerHeight);
        const position = Math.max(0, Math.min(1, -rect.top / distance));
        if (animation) animation.currentTime = position * 1000;
        const stage = Math.min(2, Math.floor(position * 3));
        if (this.stage() !== stage) this.stage.set(stage);
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(draw);
      };
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) schedule();
      });
      const sync = () => {
        animation?.cancel();
        animation = undefined;
        if (media.matches && typeof progress.animate === 'function') {
          animation = progress.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
            duration: 1000,
            fill: 'both',
          });
          animation.pause();
        }
        this.stage.set(0);
        schedule();
      };
      observer.observe(scene);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      media.addEventListener('change', sync);
      sync();
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        animation?.cancel();
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        media.removeEventListener('change', sync);
      });
    });
  }
}
