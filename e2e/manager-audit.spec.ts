import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('audit filters, pagination and selection only consult local demonstration records', async ({
  page,
  baseURL,
}) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin)
      externalRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/auditoria');
  await expect(
    page.getByRole('heading', { name: 'Trilha de auditoria', exact: true }),
  ).toBeFocused();
  const table = page.getByRole('table', { name: /^Trilha de auditoria/ });
  await expect(table.getByRole('columnheader')).toHaveText([
    'Data e hora',
    'Usuário',
    'Operação',
    'Entidade',
  ]);
  await expect(table.getByRole('row')).toHaveCount(7);
  await expect(page.getByRole('status')).toContainText('Mostrando 1–6 de 11');
  const details = page.getByRole('complementary', { name: 'Registro selecionado' });
  await expect(details).toContainText('Reabertura');
  await expect(details).toContainText('Marina Alves');
  await expect(details).toContainText('Resolvido');
  await expect(details).toContainText('Atribuído');
  await page.getByRole('button', { name: 'Próxima', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Mostrando 7–11 de 11');
  await expect(page.getByRole('button', { name: 'Próxima', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Anterior', exact: true })).toBeFocused();
  const assignment = table.getByRole('button', { name: /Ver registro: Atribuição de técnico/ });
  await assignment.click();
  await expect(details).toContainText('04 nov 2026 às 10h15');
  await expect(details).toContainText('Rafael Costa');
  await expect(details).toContainText('#1041');
  await page.getByLabel('Usuário', { exact: true }).selectOption('system');
  await expect(page.getByRole('status')).toContainText('1–3 de 3');
  await page.getByLabel('Entidade', { exact: true }).selectOption('evidence');
  await expect(page.getByRole('status')).toContainText('1–1 de 1');
  await expect(details).toContainText('Expurgo de evidência');
  await page.getByLabel('Usuário', { exact: true }).selectOption('rafael');
  await page.getByLabel('Entidade', { exact: true }).selectOption('user');
  await expect(page.getByRole('heading', { name: 'Nenhum registro encontrado' })).toBeVisible();
  await expect(details).not.toContainText('Expurgo de evidência');
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
  await expect(page.getByLabel('Usuário', { exact: true })).toBeFocused();
  await page.getByLabel('Período', { exact: true }).selectOption('all');
  await expect(page.getByRole('status')).toContainText('de 12 registros');
  await expect(page.getByRole('button', { name: /Editar|Excluir/ })).toHaveCount(0);
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});

test('audit selection is keyboard accessible and returns focus at phone and tablet widths', async ({
  page,
}) => {
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await gotoAndWaitForHydration(page, '/app/gestor/auditoria');
    const reopening = page.getByRole('button', { name: /Ver registro: Reabertura/ });
    await page.getByRole('button', { name: 'Voltar à trilha', exact: true }).click();
    await expect(reopening).toBeFocused();
    const evidence = page.getByRole('button', {
      name: /Ver registro: Envio de evidência, EV-5521/,
    });
    await evidence.focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('heading', { name: 'Registro selecionado', exact: true }),
    ).toBeFocused();
    await expect(page.getByRole('complementary', { name: 'Registro selecionado' })).toContainText(
      'EV-5521',
    );
    await page.getByRole('button', { name: 'Voltar à trilha', exact: true }).click();
    await expect(evidence).toBeFocused();
  }
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 720 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});

test('audit records and the selected detail render without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/app/gestor/auditoria`);
  await expect(page.getByRole('table', { name: /^Trilha de auditoria/ })).toContainText(
    'Envio de evidência',
  );
  await expect(page.getByRole('complementary', { name: 'Registro selecionado' })).toContainText(
    'Reabertura',
  );
  await expect(
    page.getByRole('heading', { name: 'Trilha de auditoria', exact: true }),
  ).toBeVisible();
  await context.close();
});
