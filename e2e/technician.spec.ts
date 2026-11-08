import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

test('technician calls show assigned work, summaries and local filters', async ({ page }) => {
  await gotoAndWaitForHydration(page, '/app/tecnico');
  await expect(page.locator('app-technician-ticket-card')).toHaveCount(2);
  await expect(page.locator('main dl').first().getByRole('definition')).toHaveText(['1', '1']);
  await expect(page.locator('main')).toContainText('Prazo de resposta vencido');

  await page.getByLabel('Filtrar por estado').selectOption('ATRIBUIDO');
  await expect(page.locator('app-technician-ticket-card')).toHaveCount(1);
  await expect(page.locator('app-technician-ticket-card')).toContainText('#1041');
  await page.getByLabel('Filtrar por prioridade').selectOption('Alta');
  await expect(page.getByRole('heading', { name: 'Nenhum chamado encontrado' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.locator('app-technician-ticket-card')).toHaveCount(2);
});

test('assigned ticket starts locally and keeps its technical note across routes', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/tecnico/chamados/1041');
  await page.getByRole('button', { name: 'Iniciar atendimento' }).click();
  await expect(page.locator('app-technician-ticket-badges')).toContainText('Em atendimento');
  const steps = page.locator('section[aria-label="Etapas do atendimento"]');
  await expect(
    steps.getByRole('listitem').filter({ hasText: 'Descrição técnica' }),
  ).toHaveAttribute('aria-current', 'step');
  const description = page.getByLabel('Descrição técnica do atendimento');
  const technicalNote =
    'Painel inspecionado; conexões reapertadas e teste de continuidade concluído.';
  await description.fill(technicalNote);
  await expect(page.getByText(`${technicalNote.length} caracteres`)).toBeVisible();
  await page.getByRole('button', { name: 'Salvar descrição' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Descrição técnica salva' }),
  ).toBeVisible();
  await expect(steps.getByRole('listitem').filter({ hasText: 'Evidências' })).toHaveAttribute(
    'aria-current',
    'step',
  );

  await page.locator('input[type="file"]').nth(1).setInputFiles({
    name: 'foto-local.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  });
  await expect(
    page.locator('app-technician-evidence li').getByText('foto-local.png', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('app-technician-evidence')).toContainText('RECEBIDA');
  await expect(steps.getByRole('listitem').filter({ hasText: 'Revisão' })).toHaveAttribute(
    'aria-current',
    'step',
  );
  const history = page.locator('section[aria-labelledby="history-heading"]');
  await expect(history.getByText('Descrição técnica', { exact: true })).toBeVisible();
  await expect(history.getByText('Evidências válidas', { exact: true })).toBeVisible();

  await page.locator('main').getByRole('link', { name: 'Meus chamados' }).click();
  await page
    .locator('app-technician-ticket-card')
    .filter({ hasText: '#1041' })
    .getByRole('link', { name: 'Continuar atendimento' })
    .click();
  await expect(page).toHaveURL(/\/app\/tecnico\/chamados\/1041$/);
  await expect(description).toHaveValue(technicalNote);
  await expect(
    page.locator('app-technician-evidence li').getByText('foto-local.png', { exact: true }),
  ).toBeVisible();
});

test('evidence gallery previews fixtures, handles missing images and restores focus', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/tecnico/chamados/1042');
  const first = page.getByRole('button', { name: 'Ampliar IMG_0412.jpg, estado DISPONÍVEL' });
  await first.click();
  const dialog = page.getByRole('dialog', { name: 'Prévia da evidência' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute(
    'src',
    '/images/evidencias-ilustrativas.webp',
  );
  await dialog.getByRole('button', { name: 'Próxima evidência' }).click();
  await expect(dialog).toContainText('IMG_0413.jpg');
  await expect(dialog).toContainText('Miniatura sendo preparada');
  await page.keyboard.press('ArrowRight');
  await expect(dialog).toContainText('IMG_0414.png');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(first).toBeFocused();
});

test('completion requires valid evidence and updates only the current session', async ({
  page,
}) => {
  const writes: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' || ['fetch', 'xhr'].includes(request.resourceType()))
      writes.push(request.url());
  });
  await gotoAndWaitForHydration(page, '/app/tecnico');
  await page.getByRole('link', { name: 'Iniciar atendimento' }).click();
  await page.getByRole('button', { name: 'Iniciar atendimento' }).click();
  const complete = page.getByRole('button', { name: 'Concluir atendimento' });
  await expect(complete).toBeDisabled();
  await expect(page.getByText('Exige ao menos uma evidência anexada.')).toBeVisible();
  await page.locator('input[type="file"]').nth(1).setInputFiles({
    name: 'registro.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  });
  await expect(complete).toBeEnabled();
  await complete.click();
  const dialog = page.getByRole('dialog', { name: 'Concluir este atendimento?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Revisar novamente' })).toBeFocused();
  await dialog.getByRole('button', { name: 'Confirmar conclusão' }).click();
  await expect(page.getByText('Atendimento concluído no exemplo', { exact: true })).toBeVisible();
  await page.locator('main').getByRole('link', { name: 'Meus chamados' }).click();
  const resolvedTicket = page.locator('app-technician-ticket-card').filter({ hasText: '#1041' });
  await expect(resolvedTicket).toContainText('Resolvido no exemplo');
  await page.reload();
  await expect(
    page.locator('app-technician-ticket-card').filter({ hasText: '#1041' }),
  ).toContainText('Atribuído');
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('unsupported and oversized evidence files are rejected without a preview', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/tecnico/chamados/1041');
  await page.getByRole('button', { name: 'Iniciar atendimento' }).click();
  const picker = page.locator('input[type="file"]').nth(1);
  await picker.setInputFiles({
    name: 'nota.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });
  await expect(page.getByRole('alert')).toContainText('JPEG, PNG ou WebP');
  await expect(page.locator('app-technician-evidence ul.grid li')).toHaveCount(0);
  await picker.setInputFiles({
    name: 'grande.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
  });
  await expect(page.getByRole('alert')).toContainText('limite é 10 MB');
  await expect(page.locator('app-technician-evidence ul.grid li')).toHaveCount(0);
});

test('invalid and unassigned ticket IDs use the technician 404', async ({ page }) => {
  for (const id of ['9999', '1043', 'abc']) {
    const response = await page.goto(`/app/tecnico/chamados/${id}`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
    await expect(page.getByLabel('Perfil de demonstração')).toHaveValue('tecnico');
  }
});

test('technician list and attendance fit supported viewport widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await gotoAndWaitForHydration(page, '/app/tecnico');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await gotoAndWaitForHydration(page, '/app/tecnico/chamados/1042');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});
