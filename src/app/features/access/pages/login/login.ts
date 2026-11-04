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
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideArrowRight,
  LucideDynamicIcon,
  LucideEye,
  LucideEyeOff,
  LucideLoaderCircle,
} from '@lucide/angular';
import { ButtonPrimary } from '@app/shared/ui/button';
import { Input } from '@app/shared/ui/input/input.directive';
import { PageHeading } from '@app/shared/ui/page-heading/page-heading.directive';
import { AccessLayout } from '../../components/access-layout/access-layout';
import { ACCESS_DEMO_DELAY_MS } from '../../data/access-demo';

@Component({
  selector: 'app-login',
  imports: [
    AccessLayout,
    ReactiveFormsModule,
    ButtonPrimary,
    Input,
    PageHeading,
    LucideDynamicIcon,
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class Login {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly emailInput = viewChild.required<ElementRef<HTMLInputElement>>('emailInput');
  private readonly passwordInput =
    viewChild.required<ElementRef<HTMLInputElement>>('passwordInput');
  private timer?: ReturnType<typeof setTimeout>;
  protected readonly returnState = inject(ActivatedRoute).snapshot.queryParamMap.get('estado');
  protected readonly icons = {
    arrow: LucideArrowRight,
    eye: LucideEye,
    eyeOff: LucideEyeOff,
    loading: LucideLoaderCircle,
  };
  protected readonly busy = signal(false);
  protected readonly ready = signal(false);
  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    afterNextRender(() => this.ready.set(true));
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  protected fieldInvalid(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    if (!this.ready() || this.busy()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      (this.form.controls.email.invalid
        ? this.emailInput()
        : this.passwordInput()
      ).nativeElement.focus();
      return;
    }

    // Local demonstration only; any valid e-mail and non-empty password may continue.
    this.busy.set(true);
    this.timer = setTimeout(() => {
      this.busy.set(false);
      this.timer = undefined;
      this.form.reset();
      void this.router.navigateByUrl('/sessao-demo');
    }, ACCESS_DEMO_DELAY_MS);
  }
}
