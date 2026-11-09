import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-028 reading and ticket navigation remain local and isolated by recipient', async ({
  page,
  baseURL,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url());
  });
  await gotoAndWaitForHydration(page, '/app/gestor');
  const bell = page.getByRole('button', { name: /^Notificações de demonstração/ });
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, 2 não lidas');
  await bell.click();
  const panel = page.getByRole('region', { name: 'Notificações de demonstração', exact: true });
  await expect(panel.getByRole('heading', { level: 3 })).toHaveText([
    '05 de novembro de 2026',
    '04 de novembro de 2026',
  ]);
  await expect(panel.getByRole('link')).toHaveCount(3);
  await panel.getByRole('button', { name: 'Marcar como lida: Prazo de resposta violado' }).click();
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, 1 não lida');
  const response = panel.getByRole('link', {
    name: 'Abrir chamado #1043: Prazo de resposta violado. Lida',
    exact: true,
  });
  await expect(response).toBeFocused();
  await response.click();
  await expect(page).toHaveURL(/\/app\/gestor\/chamados\/1043$/);
  await expect(page.locator('main h1')).toHaveText('Instabilidade no ponto de rede');
  await expect(panel).not.toBeVisible();
  await bell.click();
  await panel.getByRole('button', { name: 'Marcar todas como lidas', exact: true }).click();
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, nenhuma não lida');
  await expect(bell.locator('span[aria-hidden]')).toHaveCount(0);
  await expect(panel.getByRole('button', { name: 'Fechar notificações' })).toBeFocused();
  await page.keyboard.press('Escape');
  await page.getByLabel('Perfil de demonstração').selectOption('tecnico');
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, 2 não lidas');
  await bell.click();
  await expect(panel.getByRole('link')).toHaveCount(4);
  await panel.getByRole('link', { name: /^Abrir chamado #1042: Atendimento reatribuído/ }).click();
  await expect(page).toHaveURL(/\/app\/tecnico\/chamados\/1042$/);
  await expect(page.locator('main h1')).toContainText('Falha no sistema de climatização');
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, 1 não lida');
  await page.getByLabel('Perfil de demonstração').selectOption('gestor');
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, nenhuma não lida');
  await gotoAndWaitForHydration(page, '/app/gestor');
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, 2 não lidas');
  expect(external).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});

test('FE-028 empty, loading and error scenarios have consistent counts and recover locally', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoAndWaitForHydration(page, '/app/gestor');
  const bell = page.getByRole('button', { name: /^Notificações de demonstração/ });
  await bell.click();
  const panel = page.getByRole('region', { name: 'Notificações de demonstração', exact: true });
  await panel.getByText('Estados da demonstração', { exact: true }).click();
  const scenario = panel.getByLabel('Visualizar cenário');
  await scenario.selectOption('empty');
  await expect(panel.getByRole('status')).toContainText('Nenhuma notificação');
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, nenhuma não lida');
  await expect(panel.getByRole('link')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await scenario.selectOption('loading');
  await expect(panel.getByRole('status')).toContainText('Carregando notificações de exemplo');
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, contagem indisponível');
  expect(
    await panel.locator('.animate-spin').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await scenario.selectOption('error');
  await expect(panel.getByRole('alert')).toContainText('Não foi possível mostrar');
  await panel.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(panel.getByRole('link')).toHaveCount(3);
  await expect(bell).toHaveAccessibleName('Notificações de demonstração, 2 não lidas');
  await expect(panel.getByRole('button', { name: 'Fechar notificações' })).toBeFocused();
});

test('FE-028 panel fits viewports and supports keyboard dismissal without trapping focus', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/tecnico');
  const bell = page.getByRole('button', { name: /^Notificações de demonstração/ });
  const panel = page.getByRole('region', { name: 'Notificações de demonstração', exact: true });
  for (const [width, height] of [
    [1440, 900],
    [768, 900],
    [390, 844],
    [320, 568],
    [1440, 400],
  ]) {
    await page.setViewportSize({ width, height });
    await bell.focus();
    await page.keyboard.press('ArrowDown');
    await expect(panel.getByRole('heading', { name: 'Notificações', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(panel.getByRole('button', { name: 'Fechar notificações' })).toBeFocused();
    const bounds = (await panel.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.keyboard.press('Escape');
    await expect(bell).toBeFocused();
    await expect(panel).not.toBeVisible();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await bell.click();
  await panel.getByText('Estados da demonstração', { exact: true }).click();
  await panel.getByLabel('Visualizar cenário').focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Menu de Rafael Costa', exact: true }),
  ).toBeFocused();
  await expect(panel).not.toBeVisible();
  await bell.click();
  await page.locator('main h1').click();
  await expect(panel).not.toBeVisible();
});

test('FE-028 server HTML shows the bell only for manager and technician profiles', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const profile of ['gestor', 'tecnico', 'cliente']) {
    await page.goto(`${baseURL}/app/${profile}`);
    const bell = page.getByRole('button', { name: /^Notificações de demonstração/ });
    if (profile === 'cliente') await expect(bell).toHaveCount(0);
    else await expect(bell).toHaveAccessibleName('Notificações de demonstração, 2 não lidas');
  }
  await context.close();
});
