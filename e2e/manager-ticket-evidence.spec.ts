import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-026 retries evidence processing locally and shows both outcomes', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://localhost:4200/')) externalRequests.push(request.url());
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1042');

  const evidence = page.getByRole('region', { name: 'Evidências do atendimento' });
  const notice = evidence.locator('[aria-live="polite"]');
  await expect(evidence).toContainText('painel-climatizacao.jpg');
  await expect(evidence).toContainText('Falha de processamento');
  await expect(evidence).toContainText('O arquivo original continua preservado.');
  await expect(evidence.getByText('FALHA', { exact: true })).toBeVisible();

  const retry = evidence.getByRole('button', {
    name: 'Reprocessar evidência painel-climatizacao.jpg',
  });
  await retry.click();
  const dialog = page.getByRole('dialog', { name: 'Reprocessar evidência' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Nenhum arquivo será enviado ou retransmitido.')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Voltar' })).toBeFocused();
  await page.screenshot({ path: 'tmp/fe026-evidence-dialog-desktop.png' });

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(retry).toBeFocused();

  await retry.click();
  await dialog.getByLabel('Resultado simulado').selectOption('FALHA');
  await dialog.getByRole('button', { name: 'Confirmar reprocessamento' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(evidence.getByText('PROCESSANDO', { exact: true })).toBeVisible();
  await expect(notice).toContainText('Reprocessando miniatura');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe026-evidence-processing-mobile.png', fullPage: true });
  await expect(notice).toContainText('Nova falha na demonstração', {
    timeout: 5000,
  });
  await expect(evidence.getByText('FALHA', { exact: true })).toBeVisible();

  await evidence
    .getByRole('button', { name: 'Reprocessar evidência painel-climatizacao.jpg' })
    .click();
  await page.getByRole('dialog').getByLabel('Resultado simulado').selectOption('DISPONÍVEL');
  await page.getByRole('dialog').getByRole('button', { name: 'Confirmar reprocessamento' }).click();
  await expect(evidence.getByText('PROCESSANDO', { exact: true })).toBeVisible();
  await expect(notice).toContainText('Reprocessando miniatura');
  await expect(notice).toContainText('Miniatura disponível', {
    timeout: 5000,
  });
  await expect(evidence.getByText('DISPONÍVEL', { exact: true })).toBeVisible();
  await expect(
    evidence.getByRole('button', { name: 'Reprocessar evidência painel-climatizacao.jpg' }),
  ).toHaveCount(0);

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});
