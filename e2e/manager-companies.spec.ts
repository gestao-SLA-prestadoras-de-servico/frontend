import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('company controls preserve validation, local editing and dialog focus', async ({
  page,
  baseURL,
}) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin)
      externalRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/empresas/nova');

  const legalName = 'Empresa de demonstração visual Ltda.';
  const renamed = 'Empresa de demonstração revisada Ltda.';
  const submit = page.getByRole('button', { name: 'Concluir cadastro' });
  await submit.click();
  await expect(page.getByLabel('Razão social')).toBeFocused();
  await page.getByLabel('Razão social').fill(legalName);
  await page.getByLabel('E-mail de contato').fill('contato@visual.example');
  await page.getByLabel('Endereço', { exact: true }).fill('Rua do Exemplo, 120 · São Paulo/SP');
  await submit.click();
  await expect(
    page.getByRole('heading', { name: 'Cadastro demonstrativo concluído' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Ver empresas' }).click();

  const editTrigger = page
    .getByRole('button', { name: `Editar ${legalName}`, exact: true })
    .first();
  await editTrigger.click();
  const editDialog = page.getByRole('dialog', { name: 'Editar empresa', exact: true });
  await expect(editDialog.getByLabel('Razão social')).toBeFocused();
  await editDialog.getByLabel('Razão social').fill(renamed);
  await editDialog.getByLabel('E-mail de contato').fill('revisado@visual.example');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'tmp/manager-standardization/company-edit-390.png' });
  await editDialog.getByRole('button', { name: 'Salvar edição demonstrativa' }).click();
  await expect(editDialog).not.toBeVisible();
  await expect(page.getByRole('status')).toContainText('Edição demonstrativa concluída');

  await page.setViewportSize({ width: 1440, height: 900 });
  const row = page.getByRole('row').filter({ hasText: renamed });
  await expect(row).toContainText('revisado@visual.example');
  const deactivateTrigger = row.getByRole('button', { name: `Inativar ${renamed}`, exact: true });
  await deactivateTrigger.click();
  const deactivateDialog = page.getByRole('dialog', { name: 'Confirmar inativação?' });
  await expect(deactivateDialog.getByRole('button', { name: 'Manter ativa' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(deactivateDialog).not.toBeVisible();
  await expect(deactivateTrigger).toBeFocused();
  await deactivateTrigger.click();
  await deactivateDialog.getByRole('button', { name: 'Confirmar inativação', exact: true }).click();
  await expect(row).toContainText('Inativa');
  await expect(page.getByRole('status')).toContainText('Inativação demonstrativa concluída');
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});
