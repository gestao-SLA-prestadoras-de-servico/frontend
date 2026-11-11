import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-019 lists contract terms and opens an accessible details dialog', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/contratos');
  await expect(page.locator('main h1')).toHaveText('Contratos');
  await expect(page.getByText('05/11/2026', { exact: false })).toBeVisible();
  await expect(page.getByRole('row', { name: /CT-2026-014/ })).toContainText('Vigente');
  await expect(page.getByRole('row', { name: /CT-2026-020/ })).toContainText('Futuro');
  await expect(page.getByRole('row', { name: /CT-2026-009/ })).toContainText('Vencido');
  await page.screenshot({ path: 'tmp/fe019-contracts-desktop.png', fullPage: true });

  await page.getByLabel('Vigência').selectOption('future');
  await expect(page.getByRole('row', { name: /CT-2026-020/ })).toBeVisible();
  await expect(page.getByRole('row', { name: /CT-2026-014/ })).toHaveCount(0);
  await page.getByLabel('Vigência').selectOption('all');
  await page.getByLabel('Buscar contrato').fill('elevadores');
  await expect(page.getByRole('row', { name: /CT-2026-009/ })).toBeVisible();
  await expect(page.getByRole('row', { name: /CT-2026-020/ })).toHaveCount(0);
  await page.getByLabel('Buscar contrato').fill('sem resultado');
  await expect(page.getByRole('heading', { name: 'Nenhum contrato encontrado' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpar busca e filtro' }).click();

  const detailsTrigger = page.getByRole('button', {
    name: 'Ver detalhes do contrato CT-2026-014',
  });
  await detailsTrigger.click();
  const details = page.getByRole('dialog', { name: 'CT-2026-014' });
  await expect(details).toBeVisible();
  await expect(details).toContainText('Manutenção predial');
  const detailsCloseButton = details.getByRole('button', { name: 'Fechar' });
  await expect(detailsCloseButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(detailsCloseButton).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(details).not.toBeVisible();
  await expect(detailsTrigger).toBeFocused();

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      'contract list should not overflow at ' + width + 'px',
    ).toBe(width);
    if (width < 1280) {
      await expect(page.locator('table')).toBeHidden();
      await expect(page.locator('article').first()).toBeVisible();
    } else {
      await expect(page.locator('table')).toBeVisible();
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe019-contracts-mobile.png', fullPage: true });
});

test('FE-019 validates, reviews, and adds a session-only contract', async ({ page, baseURL }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin)
      externalRequests.push(request.url());
  });
  await gotoAndWaitForHydration(page, '/app/gestor/contratos/nova');
  await page.screenshot({ path: 'tmp/fe019-contract-new-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe019-contract-new-mobile.png', fullPage: true });

  const reviewButton = page.getByRole('button', { name: 'Revisar cadastro' });
  await reviewButton.click();
  await expect(page.getByLabel('Empresa')).toBeFocused();
  await expect(page.getByText('Selecione uma empresa ativa.')).toBeVisible();

  await page.getByLabel('Empresa').selectOption('1');
  await page.getByLabel('Data de início').fill('2026-12-10');
  await page.getByLabel('Data de fim').fill('2026-12-01');
  await page.getByLabel('Política vinculada').selectOption('policy-building');
  await reviewButton.click();
  await expect(
    page.getByText('A data de fim deve ser igual ou posterior à data de início.'),
  ).toBeVisible();
  await expect(page.getByLabel('Data de fim')).toBeFocused();

  await page.getByLabel('Data de fim').fill('2027-12-01');
  await reviewButton.click();
  const reviewDialog = page.getByRole('dialog', { name: 'Revisar cadastro' });
  await expect(reviewDialog).toBeVisible();
  await expect(reviewDialog).toContainText('Edifício Aurora');
  await expect(reviewDialog).toContainText('POL-001 · Manutenção predial');
  const returnToForm = reviewDialog.getByRole('button', { name: 'Voltar ao formulário' });
  const confirmDraft = reviewDialog.getByRole('button', {
    name: 'Confirmar cadastro demonstrativo',
  });
  await expect(returnToForm).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(confirmDraft).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(returnToForm).toBeFocused();
  await page.screenshot({ path: 'tmp/fe019-contract-review-mobile.png', fullPage: true });
  await page.keyboard.press('Escape');
  await expect(reviewDialog).not.toBeVisible();
  await expect(reviewButton).toBeFocused();

  await reviewButton.click();
  await page.getByRole('button', { name: 'Confirmar cadastro demonstrativo' }).click();
  await expect(page.getByRole('status')).toContainText('CT-2026-021');
  await expect(page.getByText('Nenhuma informação foi enviada ou salva.')).toBeVisible();
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });

  await page.getByRole('link', { name: 'Ver contratos' }).click();
  await expect(page).toHaveURL(/\/app\/gestor\/contratos$/);
  await expect(page.getByRole('status')).toContainText('incluído somente nesta sessão');
  await expect(page.locator('article').filter({ hasText: 'CT-2026-021' })).toBeVisible();
  await expect(page.locator('dl').first()).toContainText('5');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
