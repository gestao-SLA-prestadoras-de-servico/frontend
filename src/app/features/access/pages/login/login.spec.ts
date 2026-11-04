import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { renderComponent } from '@testing/helpers';
import { ACCESS_DEMO_DELAY_MS } from '../../data/access-demo';
import { Login } from './login';

describe('Login demonstration', () => {
  let fixture: ComponentFixture<Login>;
  let page: HTMLElement;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const rendered = await renderComponent(Login);
    fixture = rendered.fixture;
    page = rendered.element;
    document.body.append(page);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => {
    fixture.destroy();
    page.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function fill(email: string, password: string): void {
    for (const [name, value] of Object.entries({ email, password })) {
      const input = page.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    fixture.detectChanges();
  }

  function submit(): void {
    page
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('explains required fields and focuses the first incomplete field', () => {
    submit();
    expect(page.textContent).toContain('Informe seu e-mail.');
    expect(page.textContent).toContain('Informe sua senha.');
    expect(document.activeElement?.id).toBe('login-email');
    expect(navigate).not.toHaveBeenCalled();

    fill('camila@empresa.com', '');
    submit();
    expect(document.activeElement?.id).toBe('login-password');
  });

  it('rejects a malformed e-mail before starting the simulated loading state', () => {
    fill('camila', 'exemplo');
    submit();
    expect(page.textContent).toContain('Digite um e-mail válido.');
    expect(page.querySelector('form')?.getAttribute('aria-busy')).toBe('false');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('accepts any valid e-mail and non-empty password after the loading state', () => {
    vi.useFakeTimers();
    fill('qualquer@empresa.com', 'senha-qualquer');
    submit();
    expect(page.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
    expect(page.textContent).toContain('Entrando…');
    vi.advanceTimersByTime(ACCESS_DEMO_DELAY_MS);
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/sessao-demo');
    expect(page.querySelector('[role="alert"]')).toBeNull();
    expect(page.querySelector<HTMLInputElement>('#login-password')?.value).toBe('');
  });

  it('ignores duplicate submissions while loading', () => {
    vi.useFakeTimers();
    fill('pessoa@empresa.com', 'senha');
    submit();
    submit();
    vi.advanceTimersByTime(ACCESS_DEMO_DELAY_MS);
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/sessao-demo');
    expect(page.querySelector<HTMLInputElement>('#login-password')?.value).toBe('');
  });

  it('cancels pending simulated work when the page is destroyed', () => {
    vi.useFakeTimers();
    fill('pessoa@empresa.com', 'senha');
    submit();
    fixture.destroy();
    vi.advanceTimersByTime(ACCESS_DEMO_DELAY_MS);
    expect(navigate).not.toHaveBeenCalled();
  });
});
