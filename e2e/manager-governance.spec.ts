import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-029/030 report filters reconcile the sample, show empty rates and restore keyboard focus', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/gestor/relatorios');
  const metrics = page
    .getByRole('region', { name: 'Indicadores do relatório' })
    .locator('dd > span:first-child');
  await expect(metrics).toHaveText(['56', '96%', '91%', '88%']);
  const summary = page.getByRole('region', { name: 'Cumprimento por prazo', exact: true });
  await expect(summary).toContainText('54 cumpridos · 2 violados');
  await expect(summary).toContainText('Dentro do prazo');
  await expect(summary).toContainText('Fora do prazo');
  const period = page.getByLabel('Período', { exact: true });
  await period.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Cliente', { exact: true })).toBeFocused();
  await page.getByLabel('Cliente', { exact: true }).selectOption('Edifício Aurora');
  await page.getByLabel('Técnico', { exact: true }).selectOption('Rafael Costa');
  await expect(metrics).toHaveText(['10', '90%', '80%', '80%']);
  await expect(page.getByRole('status')).toContainText(
    'Edifício Aurora · Rafael Costa · 10 chamados',
  );
  await expect(page.getByRole('table', { name: /^Por cliente/ }).getByRole('row')).toHaveCount(2);
  await expect(page.getByRole('table', { name: /^Por técnico/ }).getByRole('row')).toHaveCount(2);
  await page.getByLabel('Cliente', { exact: true }).selectOption('Clínica Horizonte');
  await expect(metrics).toHaveText(['0', '—', '—', '—']);
  await expect(page.getByRole('heading', { name: 'Nenhum chamado encontrado' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Exportar PDF' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Exportar CSV' })).toBeDisabled();
  await expect(page.getByRole('table')).toHaveCount(0);
  await page.getByRole('button', { name: 'Restaurar amostra' }).click();
  await expect(period).toBeFocused();
  await expect(metrics).toHaveText(['56', '96%', '91%', '88%']);
  await period.selectOption('2026-10');
  await expect(metrics).toHaveText(['0', '—', '—', '—']);
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
  await expect(period).toHaveValue('2026-09');
  await expect(period).toBeFocused();
});

test('FE-031 export shows processing and completion locally without downloads or external requests', async ({
  page,
  baseURL,
}) => {
  const external: string[] = [],
    downloads: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url());
  });
  page.on('download', (download) => downloads.push(download.suggestedFilename()));
  await page.setViewportSize({ width: 390, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoAndWaitForHydration(page, '/app/gestor/relatorios');
  const dialog = page.getByRole('dialog', { name: 'Exportação de demonstração' });
  for (const format of ['PDF', 'CSV']) {
    const trigger = page.getByRole('button', { name: 'Exportar ' + format, exact: true });
    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('status')).toContainText('Preparando ' + format);
    await expect(dialog).toContainText('56 chamados');
    const close = dialog.getByRole('button', { name: 'Fechar exportação' });
    await expect(close).toBeFocused();
    expect(
      await dialog.locator('.animate-spin').evaluate((el) => getComputedStyle(el).animationName),
    ).toBe('none');
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('button', { name: 'Concluir simulação' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await dialog.getByRole('button', { name: 'Concluir simulação' }).click();
    await expect(dialog.getByRole('status')).toHaveText(
      'Simulação concluída. Nenhum arquivo foi gerado ou baixado.',
    );
    await expect(close).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.getByRole('button', { name: 'Exportar PDF', exact: true }).click();
  await dialog.getByRole('button', { name: 'Cancelar simulação' }).click();
  await expect(page.getByRole('button', { name: 'Exportar PDF', exact: true })).toBeFocused();
  expect(downloads).toEqual([]);
  expect(external).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('FE-032/033 audit loading preserves filters and the purged event opens metadata only', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/gestor/auditoria');
  await page.getByLabel('Usuário', { exact: true }).selectOption('system');
  await page.getByLabel('Entidade', { exact: true }).selectOption('evidence');
  await page.getByText('Estados da demonstração', { exact: true }).click();
  await page.getByLabel('Visualizar cenário da auditoria').selectOption('loading');
  await expect(page.getByRole('status')).toHaveText('Carregando registros de demonstração…');
  await expect(page.getByRole('table')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Consultar metadados' })).toHaveCount(0);
  await page.getByLabel('Visualizar cenário da auditoria').selectOption('list');
  await expect(page.getByLabel('Usuário', { exact: true })).toHaveValue('system');
  await expect(page.getByRole('status')).toContainText('1–1 de 1');
  await page.getByRole('link', { name: 'Consultar metadados' }).click();
  await expect(page).toHaveURL(/\/app\/gestor\/auditoria\/evidencias\/EV-4310$/);
  await expect(page.locator('main h1')).toHaveText('Evidência expurgada');
  await expect(page.locator('main h1')).toBeFocused();
  await expect(
    page
      .getByRole('navigation', { name: 'Navegação da área de Gestor' })
      .getByRole('link', { name: 'Auditoria', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  const card = page.getByRole('region', { name: 'Rastreabilidade da evidência' });
  await expect(card).toContainText('EXPURGADA');
  await expect(card).toContainText('AT-2089');
  await expect(card.locator('time').first()).toHaveAttribute(
    'datetime',
    '2026-04-15T10:20:00-03:00',
  );
  await expect(card.locator('time').last()).toHaveAttribute(
    'datetime',
    '2026-10-30T02:00:00-03:00',
  );
  await expect(card.locator('time')).toHaveText(['15 abr 2026 às 10h20', '30 out 2026 às 02h00']);
  await expect(card.locator('img')).toHaveCount(0);
  await expect(card.getByRole('button')).toHaveCount(0);
  await expect(card.getByRole('link')).toHaveCount(0);
  await page.getByRole('link', { name: 'Voltar à auditoria' }).click();
  await expect(page.locator('main h1')).toHaveText('Trilha de auditoria');
  const response = await page.goto('/app/gestor/auditoria/evidencias/EV-inexistente');
  expect(response?.status()).toBe(404);
  await expect(page.locator('main h1')).toContainText('não encontrada');
});

test('FE-029 to 033 fit phone, tablet, desktop and short viewports', async ({ page }) => {
  for (const route of ['relatorios', 'auditoria', 'auditoria/evidencias/EV-4310']) {
    for (const [width, height] of [
      [320, 568],
      [390, 844],
      [768, 900],
      [1440, 900],
      [1440, 400],
    ]) {
      await page.setViewportSize({ width, height });
      await gotoAndWaitForHydration(page, '/app/gestor/' + route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (route === 'relatorios') {
        await page.getByRole('button', { name: 'Exportar CSV', exact: true }).click();
        const dialog = page.getByRole('dialog');
        const bounds = (await dialog.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        expect(bounds.y).toBeGreaterThanOrEqual(0);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
        await dialog.getByRole('button', { name: 'Concluir simulação' }).click();
        await page.keyboard.press('Escape');
      }
    }
  }
});

test('FE-033 metadata is prerendered and invalid identifiers return no metadata', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto(`${baseURL}/app/gestor/auditoria/evidencias/EV-4310`);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('region', { name: 'Rastreabilidade da evidência' })).toContainText(
    'EXPURGADA',
  );
  await expect(page.locator('main time')).toHaveCount(2);
  const missing = await page.goto(`${baseURL}/app/gestor/auditoria/evidencias/EV-inexistente`);
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('region', { name: 'Rastreabilidade da evidência' })).toHaveCount(0);
  await context.close();
});
