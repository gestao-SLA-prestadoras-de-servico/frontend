import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-027 stores completion notification choices locally per ticket', async ({
  page,
  baseURL,
}) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin)
      externalRequests.push(request.url());
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1042');

  const heading = page.getByRole('heading', { name: 'Avisos de conclusão' });
  const toggle = page.getByRole('switch', { name: /Avisar somente este Gestor/ });
  await expect(heading).toBeVisible();
  await expect(toggle).toBeEnabled();
  await expect(toggle).toBeChecked();
  await expect(
    page.getByText('A escolha é individual por Gestor. Cada pessoa define seus próprios avisos.'),
  ).toBeVisible();
  await page.screenshot({ path: 'tmp/fe027-notifications-desktop.png', fullPage: true });

  await toggle.focus();
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Space');
  await expect(toggle).not.toBeChecked();
  await expect(page.getByRole('status')).toContainText(
    'Avisos de conclusão desligados neste chamado apenas para o seu usuário Gestor.',
  );
  await page.keyboard.press('Space');
  await expect(toggle).toBeChecked();
  await expect(page.getByRole('status')).toContainText(
    'Avisos de conclusão ligados neste chamado apenas para o seu usuário Gestor.',
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe027-notifications-mobile.png', fullPage: true });
  await expect(toggle).toBeChecked();

  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1041');
  const disabledByDefault = page.getByRole('switch', {
    name: /Avisar somente este Gestor/,
  });
  await expect(disabledByDefault).toBeEnabled();
  await expect(disabledByDefault).not.toBeChecked();
  await expect(page.getByText('Avisos desligados neste chamado.')).toBeVisible();
  await page.locator('label[for="completion-notification-switch"]').click();
  await expect(disabledByDefault).toBeChecked();
  await expect(page.getByRole('status')).toContainText('Avisos de conclusão ligados');

  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1036');
  const unavailable = page.getByRole('switch', { name: /Avisar somente este Gestor/ });
  await expect(unavailable).toBeDisabled();
  await expect(unavailable).not.toBeChecked();
  await expect(page.getByText('Indisponível', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Aviso indisponível para chamados cancelados ou encerrados.'),
  ).toBeVisible();

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});
