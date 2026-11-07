import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-022 dashboard summarizes the shared ticket scene and links into the queue', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor');

  await expect(page.locator('main h1')).toHaveText('Painel de operações');
  const indicators = page.getByRole('region', { name: 'Indicadores da fila' }).locator('dd');
  await expect(indicators).toHaveText(['1', '1', '1', '1']);
  await expect(page.getByRole('link', { name: /Abrir fila de chamados/ })).toBeVisible();
  const attentionTable = page.getByRole('table', { name: 'Chamados que pedem atenção' });
  await expect(attentionTable.getByRole('row')).toHaveCount(5);
  await expect(attentionTable).toContainText('Falha no sistema de climatização');
  await expect(attentionTable).toContainText('Oscilação no quadro elétrico');
  await expect(attentionTable).toContainText('Ajuste da bomba de circulação');
  await expect(attentionTable).toContainText('Prazo violado');
  await expect(page.getByRole('heading', { name: 'Chamados por estados' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cumprimentos SLA do mês' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Carga por técnico' })).toBeVisible();
  const slaSummary = page.getByRole('region', { name: 'Cumprimentos SLA do mês' });
  await expect(slaSummary).toContainText('96%');
  await expect(slaSummary).toContainText('54 cumpridos · 2 violados');
  await expect(slaSummary).toContainText('91%');
  await expect(slaSummary).toContainText('51 cumpridos · 5 violados');
  await expect(slaSummary).toContainText('88%');
  await expect(slaSummary).toContainText('49 cumpridos · 7 violados');
  const workload = page.getByRole('region', { name: 'Carga por técnico' });
  await expect(workload).toContainText('Bruno Prado');
  await expect(workload).toContainText('4 de 4');
  await expect(workload).toContainText('Rafael Costa');
  await expect(workload).toContainText('2 de 4');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /Abrir fila de chamados/ })).toBeFocused();
  await page.screenshot({ path: 'tmp/fe022-dashboard-desktop.png', fullPage: true });

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe022-dashboard-mobile.png', fullPage: true });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('link', { name: 'Abrir fila de chamados' }).click();
  await expect(page).toHaveURL(/\/app\/gestor\/chamados$/);
  await expect(page.locator('main h1')).toHaveText('Fila de chamados');
  const queue = page.getByRole('table');
  await expect(queue.getByRole('row')).toHaveCount(7);
  await expect(queue.getByRole('columnheader')).toHaveText([
    'Chamado',
    'Prioridade',
    'Estado',
    'Técnico',
    'Aberto em',
    'Relógios',
  ]);
  const openTicket = queue.getByRole('row').filter({ hasText: '#1043' });
  await expect(openTicket.getByRole('rowheader')).toContainText('Instabilidade no ponto de rede');
  await expect(openTicket.getByRole('rowheader')).toContainText('Clínica Horizonte');
  await expect(openTicket.getByRole('cell').nth(3)).toContainText('05 nov');
  await expect(openTicket.getByRole('cell').nth(3)).toContainText('08h40');
  const clocks = openTicket.getByRole('list', { name: 'Relógios de SLA' });
  await expect(clocks.getByRole('listitem')).toHaveCount(3);
  await expect(clocks).toContainText('Resp');
  await expect(clocks).toContainText('Violado');
  await expect(clocks).toContainText('Campo');
  await expect(clocks).toContainText('Resol');
  await expect(queue.getByRole('row').filter({ hasText: '#1036' })).toContainText(
    'Sem apuração de SLA',
  );
  const statusIcons = await queue
    .locator('tbody tr')
    .evaluateAll((rows) =>
      rows.map((row) => row.querySelector('td:nth-of-type(2) svg')?.innerHTML),
    );
  expect(new Set(statusIcons).size).toBe(6);
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
  const mobileTicket = page.locator('article').filter({ hasText: '#1043' });
  await expect(mobileTicket).toContainText('Clínica Horizonte');
  await expect(mobileTicket).toContainText('Aberto em');
  await expect(mobileTicket.getByRole('list', { name: 'Relógios de SLA' })).toBeVisible();
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
