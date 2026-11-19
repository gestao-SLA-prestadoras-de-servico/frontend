import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { renderComponent } from '@testing/helpers';
import { Login } from './login';

describe('Login', () => {
  const perfil = signal<string | null>(null);
  const login = vi.fn();

  async function render() {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { perfil, login } }],
    });
    const navigate = vi.spyOn(Router.prototype, 'navigateByUrl').mockResolvedValue(true);
    const { fixture, element } = await renderComponent(Login);
    fixture.detectChanges();
    return { fixture, element, navigate };
  }

  afterEach(() => {
    perfil.set(null);
    vi.restoreAllMocks();
    login.mockReset();
  });

  it('starts the Keycloak flow once, even with repeated clicks', async () => {
    const { fixture, element } = await render();
    const button = element.querySelector<HTMLButtonElement>('button')!;
    button.click();
    button.click();
    fixture.detectChanges();
    expect(login).toHaveBeenCalledOnce();
    expect(element.textContent).toContain('Redirecionando…');
    fixture.destroy();
  });

  it('sends an authenticated user to the home of their role', async () => {
    perfil.set('tecnico');
    const { fixture, navigate } = await render();
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/app/tecnico');
    fixture.destroy();
  });
});
