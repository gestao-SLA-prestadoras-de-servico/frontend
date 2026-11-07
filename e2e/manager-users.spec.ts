import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('FE-021 filters profiles and simulates technician replacement with load blocking', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/usuarios');

  await expect(page.locator('main h1')).toHaveText('Usuários');
  await expect(page.getByRole('table')).toContainText('Cliente');
  await expect(page.getByRole('table')).toContainText('Técnico');
  await expect(page.getByRole('table')).toContainText('Gestor');
  await page.screenshot({ path: 'tmp/fe021-users-desktop.png', fullPage: true });

  await page.getByLabel('Perfil', { exact: true }).selectOption('Técnico');
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(5);
  await page.getByLabel('Buscar usuário').fill('Camila');
  await expect(page.getByText('Nenhum usuário encontrado')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.getByRole('table')).toContainText('Rafael Costa');

  const deactivate = page.getByRole('button', { name: 'Inativar Rafael Costa' }).first();
  await deactivate.click();
  const dialog = page.getByRole('dialog', { name: 'Inativar Rafael Costa' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Voltar' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(deactivate).toBeFocused();
  await deactivate.click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Atribuídos');
  await expect(dialog).toContainText('Em atendimento');
  await expect(dialog).toContainText('Resolvidos');
  await expect(dialog).toContainText('2 chamados abertos');

  const substitute = page.getByLabel('Técnico substituto');
  await substitute.selectOption('user-bruno');
  await expect(page.getByRole('alert')).toContainText('já está no limite');
  await expect(page.getByRole('button', { name: 'Inativar e indicar substituto' })).toBeDisabled();
  await substitute.selectOption('user-juliana');
  await expect(page.getByText('Carga compatível para a demonstração')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'tmp/fe021-deactivate-modal-mobile.png' });
  await dialog.evaluate((element) => element.scrollTo(0, element.scrollHeight));
  await expect(
    page.getByRole('button', { name: 'Inativar e indicar substituto' }),
  ).toBeInViewport();
  await page.screenshot({ path: 'tmp/fe021-deactivate-modal-actions-mobile.png' });
  await page.getByRole('button', { name: 'Inativar e indicar substituto' }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('status')).toContainText('Inativação demonstrativa concluída');
  await expect(page.getByRole('table')).toContainText('Rafael Costa');
  const rafaelRow = page.getByRole('row').filter({ hasText: 'Rafael Costa' });
  await expect(rafaelRow).toContainText('Inativo');
  await expect(page.getByRole('status')).toContainText(
    '2 chamados foram indicados para Juliana Pires',
  );

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.getByRole('heading', { name: 'Equipe e contatos' })).toBeVisible();
  await page.screenshot({ path: 'tmp/fe021-users-mobile.png', fullPage: true });
});

test('FE-021 validates the visual user form for each role and confirms a local demo', async ({
  page,
  baseURL,
}) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin)
      externalRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoAndWaitForHydration(page, '/app/gestor/usuarios/novo');
  await expect(page.locator('main h1')).toHaveText('Novo usuário');

  const submit = page.getByRole('button', { name: 'Simular cadastro' });
  await submit.click();
  await expect(page.getByLabel('Nome completo')).toBeFocused();
  await expect(page.getByText('Informe um nome entre 3 e 100 caracteres.')).toBeVisible();
  await expect(page.getByText('Selecione a empresa vinculada ao perfil Cliente.')).toBeVisible();

  await page.getByLabel('Nome completo').fill('Marina Alves');
  await page.getByLabel('E-mail', { exact: true }).fill('marina@aurora.example');
  await page.getByLabel('Empresa vinculada').selectOption('Edifício Aurora');
  await submit.click();
  await expect(page.getByLabel('E-mail')).toBeFocused();
  await expect(page.getByText('Este e-mail já aparece na lista demonstrativa.')).toBeVisible();

  await page.getByLabel('E-mail', { exact: true }).fill('paula.nova@nivelo.example');
  await page.getByLabel('Nome completo').fill('Paula Nova');
  await page.getByLabel('Perfil de acesso').selectOption('Técnico');
  await expect(page.getByLabel('Empresa vinculada')).toHaveCount(0);
  await page.getByLabel('Perfil de acesso').selectOption('Gestor');
  await expect(page.getByLabel('Empresa vinculada')).toHaveCount(0);
  await page.getByLabel('Perfil de acesso').selectOption('Técnico');
  await page.screenshot({ path: 'tmp/fe021-user-new-desktop.png', fullPage: true });
  await submit.click();
  await expect(page).toHaveURL(/\/app\/gestor\/usuarios$/);
  await expect(page.getByRole('status')).toContainText('Nenhuma conta foi criada no Keycloak');
  await expect(page.getByRole('table')).toContainText('Paula Nova');

  await page.setViewportSize({ width: 390, height: 844 });
  await gotoAndWaitForHydration(page, '/app/gestor/usuarios/novo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'tmp/fe021-user-new-mobile.png', fullPage: true });
  expect(externalRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
});
