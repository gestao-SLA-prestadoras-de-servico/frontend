import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('reports share consistent monthly indicators and accessible customer and technician breakdowns', async ({
  page,
  baseURL,
}) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin)
      externalRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/relatorios');
  await expect(page.locator('main h1')).toBeFocused();
  await expect(page.locator('main')).toContainText('Dados fictícios');
  const indicators = page.getByRole('region', { name: 'Indicadores do relatório' });
  await expect(indicators.locator('dt > span:first-child')).toHaveText([
    'Chamados apurados',
    'SLA de resposta',
    'SLA de atendimento em campo',
    'SLA de resolução',
  ]);
  await expect(indicators.locator('dd > span:first-child')).toHaveText(['56', '96%', '91%', '88%']);
  const clients = page.getByRole('table', { name: /^Por cliente/ });
  const technicians = page.getByRole('table', { name: /^Por técnico/ });
  for (const [table, subject] of [
    [clients, 'Cliente'],
    [technicians, 'Técnico'],
  ] as const) {
    await expect(table.getByRole('columnheader')).toHaveText([
      subject,
      'Chamados',
      'Resposta',
      'Atendimento em campo',
      'Resolução',
    ]);
    await expect(table.getByRole('row')).toHaveCount(5);
    const total = await table
      .locator('tbody tr')
      .evaluateAll((rows) =>
        rows.reduce((sum, row) => sum + Number(row.querySelector('td')!.textContent), 0),
      );
    expect(total).toBe(56);
  }
  await expect(clients.getByRole('rowheader')).toHaveText([
    'Edifício Aurora',
    'Clínica Horizonte',
    'Mercado Estação',
    'Residencial Alameda',
  ]);
  await expect(technicians.getByText('Não se aplica:', { exact: false })).toHaveCount(4);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Voltar ao painel', exact: true })).toBeFocused();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (width < 768) {
      await expect(page.getByRole('table')).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Por cliente', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Por técnico', exact: true })).toBeVisible();
    }
  }
  await page.getByRole('link', { name: 'Voltar ao painel', exact: true }).click();
  const monthly = page.getByRole('region', { name: 'Cumprimentos SLA do mês' });
  await expect(monthly).toContainText('54 cumpridos');
  await expect(monthly).toContainText('51 cumpridos');
  await expect(monthly).toContainText('49 cumpridos');
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});

test('report metrics and tables are rendered without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/app/gestor/relatorios`);
  await expect(page.getByRole('heading', { name: 'Relatórios', exact: true })).toBeVisible();
  await expect(page.getByRole('table', { name: /^Por cliente/ })).toContainText('Edifício Aurora');
  await expect(page.getByRole('table', { name: /^Por técnico/ })).toContainText('Rafael Costa');
  await expect(page.getByRole('region', { name: 'Indicadores do relatório' })).toContainText('96%');
  await context.close();
});
