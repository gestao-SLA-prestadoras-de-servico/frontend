import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-022 dashboard summarizes the shared ticket scene and links into the queue', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor');

  await expect(page.locator('main h1')).toHaveText('Painel de operações');
  const indicators = page
    .getByRole('region', { name: 'Indicadores da fila' })
    .getByRole('definition');
  await expect(indicators.nth(0)).toHaveText('3');
  await expect(indicators.nth(1)).toHaveText('2');
  await expect(indicators.nth(2)).toHaveText('1');
  await expect(page.getByRole('link', { name: /Abrir fila de chamados/ })).toBeVisible();
  await expect(page.getByText('Falha no sistema de climatização')).toBeVisible();
  await expect(page.getByText('Oscilação no quadro elétrico')).toBeVisible();
  await page.screenshot({ path: 'tmp/fe022-dashboard-desktop.png', fullPage: true });

  await page.getByRole('link', { name: 'Abrir fila de chamados' }).click();
  await expect(page).toHaveURL(/\/app\/gestor\/chamados$/);
  await expect(page.locator('main h1')).toHaveText('Fila de chamados');
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(7);
  await page.screenshot({ path: 'tmp/fe022-queue-desktop.png', fullPage: true });

  await page.getByLabel('Cliente').selectOption('Clínica Horizonte');
  await expect(page.getByRole('table')).toContainText('Instabilidade no ponto de rede');
  await page.getByLabel('Técnico').selectOption('Rafael Costa');
  await expect(page.getByText('Nenhum chamado corresponde aos filtros')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).last().click();
  await page.getByLabel('Prioridade').selectOption('Alta');
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(3);
  await expect(page.getByRole('table')).toContainText('Falha no sistema de climatização');
  await expect(page.getByRole('table')).toContainText('Instabilidade no ponto de rede');
  await page.getByRole('button', { name: 'Limpar filtros' }).first().click();

  await page.getByLabel('Situação').selectOption('RESOLVIDO');
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(2);
  await expect(page.getByRole('table')).toContainText('Ajuste da bomba de circulação');
  await page.getByLabel('Situação').selectOption('Todas');

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe022-queue-mobile.png', fullPage: true });

  await page.getByRole('link', { name: 'Abrir detalhes' }).first().click();
  await expect(page).toHaveURL(/\/app\/gestor\/chamados\/1043$/);
  await expect(page.locator('main h1')).toHaveText('Instabilidade no ponto de rede');
  await expect(page.getByRole('heading', { name: 'Prazos do chamado' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Um prazo aparece violado');
  await page.screenshot({ path: 'tmp/fe022-ticket-detail-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'tmp/fe022-ticket-detail-mobile.png', fullPage: true });
});
