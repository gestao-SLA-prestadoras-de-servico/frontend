import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-025 requires a reason and keeps the ticket state unchanged', async ({ page, baseURL }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin)
      externalRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1042');

  const cancelAction = page.getByRole('button', { name: 'Cancelar chamado' });
  await expect(cancelAction).toBeEnabled();
  await cancelAction.click();
  const dialog = page.getByRole('dialog', { name: 'Cancelar chamado #1042' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Ação irreversível na operação');
  await expect(dialog.getByRole('button', { name: 'Voltar' })).toBeFocused();
  const reason = dialog.getByLabel(/Motivo/);
  const confirm = dialog.getByRole('button', { name: 'Confirmar cancelamento' });
  await confirm.click();
  await expect(reason).toBeFocused();
  await expect(dialog.getByText('Informe um motivo com pelo menos 10 caracteres.')).toBeVisible();
  await reason.fill('Solicitação aberta por engano.');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'tmp/fe025-cancel-dialog-mobile.png' });
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(cancelAction).toBeFocused();

  await cancelAction.click();
  await expect(dialog).toBeVisible();
  await dialog.getByLabel(/Motivo/).fill('Falha duplicada, manter o atendimento atual.');
  await dialog.getByRole('button', { name: 'Confirmar cancelamento' }).click();
  await expect(page.getByRole('status')).toContainText(
    'O status e os dados do chamado permaneceram inalterados',
  );
  await expect(page.getByText('Em atendimento', { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('link', { name: 'Voltar à fila' }).click();
  const row = page.getByRole('row').filter({ hasText: 'Falha no sistema de climatização' });
  await expect(row).toContainText('Em atendimento');
  await expect(row.getByRole('list', { name: 'Relógios de SLA' })).toContainText(
    'Resolução: Hoje · 16h',
  );

  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1038');
  const resolvedAction = page.getByRole('button', { name: 'Cancelar chamado' });
  await expect(resolvedAction).toBeDisabled();
  await expect(
    page.getByText('Indisponível para chamados resolvidos, cancelados ou encerrados.'),
  ).toBeVisible();
  await page.screenshot({ path: 'tmp/fe025-resolved-disabled-desktop.png', fullPage: true });

  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1032');
  await expect(page.getByRole('button', { name: 'Cancelar chamado' })).toBeDisabled();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});
