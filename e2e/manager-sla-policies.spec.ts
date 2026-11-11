import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-020 shows SLA matrices, immutable history, and cross-policy comparisons', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/politicas');

  await expect(page.locator('main h1')).toHaveText('Políticas SLA');
  await expect(page.getByRole('combobox', { name: 'Política selecionada' })).toHaveValue(
    'policy-building',
  );
  const matrix = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Prazos atuais' }),
  });
  await expect(matrix).toContainText('Alta');
  await expect(matrix).toContainText('Normal');
  await expect(matrix).toContainText('Atendimento em campo');
  await expect(matrix).toContainText('1 dia útil');
  await expect(page.getByRole('heading', { name: 'Histórico de versões' })).toBeVisible();
  await expect(page.getByText('Imutável', { exact: false }).first()).toBeVisible();
  await page.screenshot({ path: 'tmp/fe020-policies-desktop-first-fold.png' });
  await page.screenshot({ path: 'tmp/fe020-policies-desktop.png', fullPage: true });

  await page.getByRole('button', { name: 'Comparar a versão 2 com a atual' }).click();
  await expect(page.getByLabel('Comparar com')).toHaveValue('policy-building-v2');
  await page.getByLabel('Comparar com').selectOption('policy-clinic-v1');
  const comparison = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Comparação de prazos' }),
  });
  await expect(comparison).toContainText('POL-003 · v1');
  await expect(comparison).toContainText('POL-001 · v3');

  await page.getByRole('button', { name: 'Ver a inconsistência' }).click();
  await expect(page.getByRole('combobox', { name: 'Política selecionada' })).toHaveValue(
    'policy-retail',
  );
  await expect(page.getByRole('status')).toContainText('Ordem inconsistente · Normal');
  await expect(page.getByLabel('Comparar com')).toHaveValue('policy-retail-v1');
  await expect(comparison).toContainText('POL-004 · v2');
  await expect(comparison).toContainText('POL-004 · v1');

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      'policy page should not overflow at ' + width + 'px',
    ).toBe(width);
    await expect(matrix).toBeVisible();
    await expect(comparison).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe020-policies-mobile.png', fullPage: true });
});

test('FE-020 validates inputs, warns without blocking, and keeps the history unchanged', async ({
  page,
  baseURL,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin)
      externalRequests.push(request.url());
  });
  await gotoAndWaitForHydration(page, '/app/gestor/politicas/editar?policy=policy-building');
  await expect(page.locator('main h1')).toHaveText('Revisar prazos');
  await page.screenshot({ path: 'tmp/fe020-policy-edit-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe020-policy-edit-mobile.png', fullPage: true });

  const response = page.getByLabel('Resposta do gestor · Alta (min)');
  const field = page.getByLabel('Atendimento em campo · Alta (min)');
  const reviewButton = page.getByRole('button', { name: 'Revisar prévia' });
  await response.fill('');
  await reviewButton.click();
  await expect(response).toBeFocused();
  await expect(page.getByText('Informe os minutos de janela.')).toBeVisible();

  await response.fill('120');
  await field.fill('120');
  const warning = page.getByRole('alert');
  await expect(warning).toContainText('Alta: resposta 120 min, campo 120 min');
  await expect(warning).toContainText('não bloqueia a prévia');
  await reviewButton.click();

  const reviewDialog = page.getByRole('dialog', { name: 'Revisão demonstrativa' });
  await expect(reviewDialog).toBeVisible();
  await expect(reviewDialog).toContainText('Nenhum valor será atualizado');
  await expect(reviewDialog).toContainText('preserva o aviso de ordem inconsistente');
  const cancelButton = reviewDialog.getByRole('button', { name: 'Voltar e editar' });
  const completeButton = reviewDialog.getByRole('button', { name: 'Concluir prévia' });
  await expect(cancelButton).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(completeButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancelButton).toBeFocused();
  await page.screenshot({ path: 'tmp/fe020-policy-review-mobile.png', fullPage: true });
  await page.keyboard.press('Escape');
  await expect(reviewDialog).not.toBeVisible();
  await expect(reviewButton).toBeFocused();

  await reviewButton.click();
  await completeButton.click();
  await expect(page.getByRole('status')).toContainText(
    'A política e o histórico permaneceram inalterados',
  );
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });

  await page.getByRole('link', { name: 'Voltar às políticas' }).click();
  await expect(page).toHaveURL(/\/app\/gestor\/politicas\?policy=policy-building$/);
  await expect(page.getByText('v3', { exact: false }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
