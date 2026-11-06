import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-023 reviews a triage locally without changing the open ticket', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://localhost:4200/')) externalRequests.push(request.url());
  });

  await gotoAndWaitForHydration(page, '/app/gestor/chamados/1043');
  await expect(page.locator('main h1')).toHaveText('Instabilidade no ponto de rede');
  await expect(page.getByText('Sugestão · Alta')).toBeVisible();
  const triage = page.getByRole('region', { name: 'Triagem' });
  const radios = triage.getByRole('radio');
  await expect(radios.nth(0)).toBeChecked();
  await radios.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth(1)).toBeChecked();
  await expect(triage).toContainText('120 min');
  await expect(triage).toContainText('540 min');
  await expect(triage).toContainText('2.160 min');
  await page.screenshot({ path: 'tmp/fe023-triage-desktop.png', fullPage: true });

  const firstPosition = page.getByLabel('Primeiro posicionamento');
  await page.getByRole('button', { name: 'Confirmar triagem' }).click();
  await expect(firstPosition).toBeFocused();
  await expect(page.getByText(/Escreva ao menos 12 caracteres/)).toBeVisible();
  await firstPosition.fill('Recebemos o relato e iniciaremos a verificação do ponto de rede.');
  await page.getByRole('button', { name: 'Confirmar triagem' }).click();

  const review = page.getByRole('dialog', { name: 'Revisar triagem' });
  await expect(review).toBeVisible();
  await expect(review).toContainText('Prioridade selecionada');
  await expect(review).toContainText('Normal');
  await expect(review).toContainText('Recebemos o relato');
  await expect(review.getByRole('button', { name: 'Voltar e revisar' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(review).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar triagem' })).toBeFocused();

  await page.getByRole('button', { name: 'Confirmar triagem' }).click();
  await expect(review).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(
    review.getByRole('button', { name: 'Concluir triagem demonstrativa' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(review.getByRole('button', { name: 'Fechar revisão da triagem' })).toBeFocused();
  await page.getByRole('button', { name: 'Concluir triagem demonstrativa' }).click();
  await expect(page.getByRole('status')).toContainText(
    'O chamado e os prazos permaneceram inalterados',
  );
  await expect(page.getByRole('status')).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'tmp/fe023-triage-mobile.png', fullPage: true });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }

  await page.getByRole('link', { name: 'Voltar à fila' }).click();
  const openTicket = page.getByRole('row').filter({ hasText: 'Instabilidade no ponto de rede' });
  await expect(openTicket).toContainText('Aberto');
  await expect(openTicket).toContainText('Alta');
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});
