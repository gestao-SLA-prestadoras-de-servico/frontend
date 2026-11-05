import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('client search and filters affect the list while the summary stays complete', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/cliente');
  const rows = page.getByRole('table').locator('tbody tr');
  await expect(rows).toHaveCount(4);
  await expect(page.getByRole('table').getByRole('columnheader')).toHaveText([
    'Chamado',
    'Estado',
    'Prioridade',
    'Aberto em',
    'Prazos',
  ]);
  await page.getByLabel('Buscar chamado').fill('climatizacao');
  await expect(rows).toHaveCount(1);
  await expect(rows).toContainText('#1042');
  await expect(page.getByRole('definition').first()).toHaveText('2');
  await page.getByLabel('Estado', { exact: true }).selectOption('RESOLVIDO');
  await expect(page.getByRole('heading', { name: 'Nenhum chamado encontrado' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpar busca e filtros' }).click();
  await expect(rows).toHaveCount(4);
  await page.getByLabel('Prioridade', { exact: true }).selectOption('Baixa');
  await expect(rows).toHaveCount(1);
  await expect(rows).toContainText('#1032');
});

test('client loading and empty scenes are explicit and reversible', async ({ page }) => {
  await gotoAndWaitForHydration(page, '/app/cliente');
  await page.getByText('Estados de demonstração', { exact: true }).click();
  await page.getByLabel('Cenário da listagem').selectOption('loading');
  await expect(page.getByRole('region', { name: 'Seus atendimentos' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  await expect(page.getByRole('status')).toHaveText('Carregando demonstração…');
  await page.getByLabel('Cenário da listagem').selectOption('empty');
  await expect(page.getByRole('heading', { name: 'Nenhum chamado neste exemplo' })).toBeVisible();
  await page.getByRole('button', { name: 'Voltar aos dados de exemplo' }).click();
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4);
});

test('client list fits phone, tablet and desktop', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await gotoAndWaitForHydration(page, '/app/cliente');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (width === 390 || width === 1440)
      await page.screenshot({ path: `tmp/client-review/list-${width}.png`, fullPage: true });
  }
});

test('opening a ticket validates fields and blocks unavailable contracts', async ({ page }) => {
  await gotoAndWaitForHydration(page, '/app/cliente/novo-chamado');
  await page.getByRole('button', { name: 'Enviar solicitação' }).click();
  await expect(page.getByLabel('Título do chamado')).toBeFocused();
  await expect(page.getByLabel('Título do chamado')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Título do chamado').fill('     ');
  await page.getByRole('button', { name: 'Enviar solicitação' }).click();
  await expect(page.getByLabel('Título do chamado')).toBeFocused();
  await page.getByLabel('Contrato', { exact: true }).selectOption('CT-2026-009');
  await expect(page.getByRole('alert')).toContainText('Contrato indisponível');
  await page.getByRole('button', { name: 'Enviar solicitação' }).click();
  await expect(page.getByLabel('Contrato', { exact: true })).toBeFocused();
  await expect(
    page.getByRole('heading', { name: 'Solicitação demonstrativa concluída' }),
  ).toHaveCount(0);
  await page.getByLabel('Contrato', { exact: true }).selectOption('CT-2026-014');
  await page.getByLabel('Título do chamado').fill('Falha na iluminação do corredor');
  await page
    .getByLabel('Descrição do problema')
    .fill('As luminárias do corredor deixaram de funcionar durante o expediente.');
  await page.getByLabel('Local do atendimento').fill('Corredor · 2º andar');
  await page.getByRole('button', { name: 'Enviar solicitação' }).click();
  await expect(
    page.getByRole('region', { name: 'Solicitação demonstrativa concluída' }),
  ).toBeFocused();
  await expect(page.locator('main')).toContainText('Nenhum chamado foi criado');
  await page.getByRole('button', { name: 'Testar outra solicitação' }).click();
  await expect(page.getByLabel('Título do chamado')).toHaveValue('');
  await expect(page.getByLabel('Título do chamado')).toBeFocused();
});

test('opening form fits phone, tablet and desktop', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await gotoAndWaitForHydration(page, '/app/cliente/novo-chamado');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (width === 390 || width === 1440)
      await page.screenshot({ path: `tmp/client-review/form-${width}.png`, fullPage: true });
  }
});

test('client rows lead to details and invalid IDs keep the profile 404', async ({ page }) => {
  await gotoAndWaitForHydration(page, '/app/cliente');
  await page.getByRole('table').getByRole('link', { name: /#1042/ }).click();
  await expect(page).toHaveURL(/\/app\/cliente\/chamados\/1042$/);
  await expect(page.locator('main h1')).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText(
    'Detalhe do chamado',
  );
  await expect(page.getByRole('heading', { name: 'Três compromissos de prazo' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Revisão indisponível neste estado' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar resolução', exact: true })).toHaveCount(
    0,
  );
  for (const id of ['invalido', '9999', '01038', '1043']) {
    const response = await page.goto(`/app/cliente/chamados/${id}`);
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: 'Página não encontrada', exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel('Perfil de demonstração')).toHaveValue('cliente');
    await page.getByRole('link', { name: 'Voltar ao início da área' }).click();
    await expect(page).toHaveURL(/\/app\/cliente$/);
  }
});

test('resolved ticket confirmation contains keyboard focus and leaves the fixture unchanged', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/cliente/chamados/1038');
  const trigger = page.getByRole('button', { name: 'Confirmar resolução', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Confirmar resolução?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    dialog.getByRole('button', { name: 'Confirmar resolução', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('button', { name: 'Confirmar resolução', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Confirmação demonstrada' })).toBeFocused();
  await expect(page.locator('app-client-status')).toHaveText('Aguardando validação');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Confirmação demonstrada' })).toHaveCount(0);
  await expect(page.locator('app-client-status')).toHaveText('Aguardando validação');
});

test('reopening requires a useful justification and shows only local feedback', async ({
  page,
}) => {
  const writes: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' || ['fetch', 'xhr'].includes(request.resourceType()))
      writes.push(request.url());
  });
  await gotoAndWaitForHydration(page, '/app/cliente/chamados/1038');
  const trigger = page.getByRole('button', { name: 'Solicitar reabertura', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Solicitar reabertura', exact: true });
  const reason = dialog.getByLabel('Justificativa da reabertura');
  await expect(reason).toBeFocused();
  await dialog.getByRole('button', { name: 'Enviar justificativa' }).click();
  await expect(reason).toHaveAttribute('aria-invalid', 'true');
  await expect(reason).toBeFocused();
  await reason.fill('                      ');
  await dialog.getByRole('button', { name: 'Enviar justificativa' }).click();
  await expect(dialog).toBeVisible();
  await reason.fill(
    'A bomba continua apresentando vibração durante a operação, mesmo após o ajuste.',
  );
  await dialog.getByRole('button', { name: 'Enviar justificativa' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Solicitação de reabertura demonstrada' }),
  ).toBeFocused();
  await expect(page.locator('app-client-status')).toHaveText('Aguardando validação');
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('detail, evidence and review dialog fit phone, tablet and desktop', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await gotoAndWaitForHydration(page, '/app/cliente/chamados/1038');
    const evidence = page.getByRole('img', { name: /Cena ilustrativa/ });
    await evidence.scrollIntoViewIfNeeded();
    await expect
      .poll(() => evidence.evaluate((image) => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (width === 390 || width === 1440)
      await page.screenshot({ path: `tmp/client-review/detail-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Solicitar reabertura', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Solicitar reabertura', exact: true });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    if (width === 390 || width === 1440)
      await page.screenshot({ path: `tmp/client-review/dialog-${width}.png` });
    await page.keyboard.press('Escape');
  }
  await gotoAndWaitForHydration(page, '/app/cliente/chamados/1032');
  await expect(
    page.getByRole('heading', { name: 'Revisão indisponível neste estado' }),
  ).toBeVisible();
});
