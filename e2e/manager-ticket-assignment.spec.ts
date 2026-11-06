import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-024 assigns and reassigns technicians with local availability conflicts', async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://localhost:4200/')) externalRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1043');

  const assignButton = page.getByRole('button', { name: 'Atribuir técnico' });
  await assignButton.click();
  const initialDialog = page.getByRole('dialog', { name: 'Atribuição inicial' });
  await expect(initialDialog).toBeVisible();
  await expect(initialDialog.getByRole('button', { name: 'Voltar' })).toBeFocused();
  const initialSelect = initialDialog.getByLabel('Técnico responsável');
  await initialSelect.selectOption('user-bruno');
  await expect(initialDialog.getByRole('alert')).toContainText('Bruno Prado atingiria 5/4');
  await expect(initialDialog.getByRole('button', { name: 'Confirmar atribuição' })).toBeDisabled();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'tmp/fe024-initial-assignment-conflict-mobile.png' });

  await initialSelect.selectOption('user-juliana');
  await expect(
    initialDialog.getByText('Juliana Pires ficará com 2/4 chamados ativos.'),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(initialDialog).not.toBeVisible();
  await expect(assignButton).toBeFocused();
  await assignButton.click();
  await expect(initialDialog).toBeVisible();
  await initialDialog.getByLabel('Técnico responsável').selectOption('user-juliana');
  await initialDialog.getByRole('button', { name: 'Confirmar atribuição' }).click();
  await expect(page.getByRole('status')).toContainText(
    'Técnico responsável atualizado para Juliana Pires',
  );
  await expect(page.getByText('Atribuído', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Juliana Pires', { exact: true }).first()).toBeVisible();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('link', { name: 'Voltar à fila' }).click();
  const queueRow = page.getByRole('row').filter({ hasText: 'Instabilidade no ponto de rede' });
  await expect(queueRow).toContainText('Atribuído');
  await expect(queueRow).toContainText('Juliana Pires');
  await page.getByRole('link', { name: /#1042 · Falha no sistema de climatização/ }).click();
  await expect(page.locator('main h1')).toHaveText('Falha no sistema de climatização');
  await expect(page.getByText('Atendimento em andamento', { exact: true })).toBeVisible();

  const reassignButton = page.getByRole('button', { name: 'Reatribuir técnico' });
  await reassignButton.click();
  const reassignDialog = page.getByRole('dialog', { name: 'Reatribuição de técnico' });
  await expect(reassignDialog).toBeVisible();
  await expect(reassignDialog).toContainText('O serviço está em andamento');
  const reassignSelect = reassignDialog.getByLabel('Novo técnico responsável');
  await reassignSelect.selectOption('user-bruno');
  await expect(reassignDialog.getByRole('alert')).toContainText('Bruno Prado atingiria 5/4');
  await expect(
    reassignDialog.getByRole('button', { name: 'Confirmar reatribuição' }),
  ).toBeDisabled();
  await reassignSelect.selectOption('user-juliana');
  await expect(
    reassignDialog.getByText('Juliana Pires ficará com 3/4 chamados ativos.'),
  ).toBeVisible();
  await page.screenshot({ path: 'tmp/fe024-reassignment-desktop.png' });
  await reassignDialog.getByRole('button', { name: 'Confirmar reatribuição' }).click();
  await expect(page.getByRole('status')).toContainText(
    'Responsável alterado de Rafael Costa para Juliana Pires',
  );
  await expect(page.getByText('Juliana Pires', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Hoje · 16h')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Técnico reatribuído' })).toBeVisible();

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe024-ticket-mobile.png', fullPage: true });
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});
