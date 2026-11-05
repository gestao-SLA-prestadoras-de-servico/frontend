import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('login validates required fields, format and password visibility', async ({ page }) => {
  await gotoAndWaitForHydration(page, '/login');
  await expect(page.getByRole('heading', { name: 'Bem-vindo à NIVELO' })).toBeFocused();
  const email = page.getByRole('textbox', { name: 'E-mail', exact: true });
  const password = page.getByLabel('Senha', { exact: true });
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Informe sua senha.', { exact: true })).toBeVisible();
  await email.fill('camila');
  await password.fill('exemplo');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByText('Digite um e-mail válido.')).toBeVisible();
  await page.getByRole('button', { name: 'Mostrar senha' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Ocultar senha' }).click();
  await expect(password).toHaveAttribute('type', 'password');
});

test('loading and local entry accept any valid credentials without sending them', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' || ['fetch', 'xhr'].includes(request.resourceType()))
      sent.push(request.url());
  });
  await gotoAndWaitForHydration(page, '/login');
  await page.getByRole('textbox', { name: 'E-mail', exact: true }).fill('qualquer@empresa.com');
  await page.getByLabel('Senha', { exact: true }).fill('senha-qualquer');
  // Hold the 650 ms demo delay so a slower browser cannot skip the loading assertion.
  await page.clock.install();
  await page.clock.pauseAt(Date.now() + 1000);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.clock.runFor(16);
  await expect(page.getByRole('button', { name: 'Entrando…' })).toBeDisabled();
  await expect(page.getByLabel('Senha', { exact: true })).toBeDisabled();
  await page.clock.runFor(700);
  await page.clock.resume();
  await expect(page).toHaveURL(/\/sessao-demo$/);
  await expect(page.getByRole('heading', { name: 'Sessão de demonstração' })).toBeFocused();
  expect(sent).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});

test('user menu supports keyboard navigation, dismiss and sign out', async ({ page }) => {
  await gotoAndWaitForHydration(page, '/sessao-demo');
  const trigger = page.getByRole('button', { name: 'Menu de Camila Moreira' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const expire = page.getByRole('menuitem', { name: 'Simular sessão expirada' });
  const exit = page.getByRole('menuitem', { name: 'Sair', exact: true });
  await expect(expire).toBeFocused();
  await page.keyboard.press('End');
  await expect(exit).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(expire).toBeFocused();
  await page.keyboard.press('Home');
  await expect(expire).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(exit).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/login\?estado=saida$/);
  await expect(
    page.getByRole('status', { name: '' }).filter({ hasText: 'Você saiu da demonstração.' }),
  ).toBeVisible();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveValue('');
});

test('menu closes on outside pointer and Tab without trapping focus', async ({ page }) => {
  await gotoAndWaitForHydration(page, '/sessao-demo');
  const trigger = page.getByRole('button', { name: 'Menu de Camila Moreira' });
  await trigger.click();
  await page.getByRole('heading', { name: 'Sessão de demonstração' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem').first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Voltar ao site', exact: true })).toBeFocused();
});

test('expired session and re-entry remain demonstrative and usable with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoAndWaitForHydration(page, '/sessao-demo');
  await page.getByRole('button', { name: 'Menu de Camila Moreira' }).click();
  await page.getByRole('menuitem', { name: 'Simular sessão expirada' }).click();
  await expect(page).toHaveURL(/\/sessao-expirada$/);
  await expect(page.getByRole('heading', { name: 'Sessão expirada' })).toBeFocused();
  await expect(
    page.getByText('Nenhuma sessão real foi encerrada.', { exact: false }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Entrar novamente' }).click();
  await expect(page).toHaveURL(/\/login\?estado=expirou$/);
  await expect(page.getByText('Informe novamente seus dados para continuar.')).toBeVisible();
  await page.getByRole('textbox', { name: 'E-mail', exact: true }).fill('pessoa@empresa.com');
  await page.getByLabel('Senha', { exact: true }).fill('qualquer-senha');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/sessao-demo$/);
});

test('access routes fit small, medium, desktop and short screens', async ({ page }) => {
  for (const size of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1024, height: 600 },
  ]) {
    await page.setViewportSize(size);
    for (const route of ['/login', '/sessao-demo', '/sessao-expirada']) {
      await gotoAndWaitForHydration(page, route);
      await expect(page.locator('h1')).toBeVisible();
      if (route === '/login') {
        await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeEnabled();
        await page.evaluate(() => document.fonts.ready);
        if (size.width >= 1024 && size.height >= 720) {
          expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
            size.height,
          );
          await expect(page.getByRole('contentinfo')).toBeInViewport({ ratio: 1 });
        }
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${route} at ${size.width}`,
      ).toBe(size.width);
      if (route === '/sessao-demo') {
        await page.getByRole('button', { name: 'Menu de Camila Moreira' }).click();
        const box = await page.getByRole('menu').boundingBox();
        expect(box?.x).toBeGreaterThanOrEqual(0);
        expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(size.width);
      }
    }
  }
});

test('all access routes contain prerendered content without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [route, heading] of [
    ['/login', 'Bem-vindo à NIVELO'],
    ['/sessao-demo', 'Sessão de demonstração'],
    ['/sessao-expirada', 'Sessão expirada'],
  ]) {
    await page.goto(`${baseURL}${route}`);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    if (route === '/login') {
      await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeDisabled();
      await expect(
        page.getByText('Ative o JavaScript para interagir com esta demonstração visual.'),
      ).toBeVisible();
    }
  }
  await context.close();
});
