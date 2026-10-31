import { expect, test } from '@playwright/test';

test('profiles support keyboard selection, local simulations and resets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const tabs = page.getByRole('tablist', { name: 'Perfis da plataforma' });
  const manager = tabs.getByRole('tab', { name: 'Gestor', exact: true });
  const technician = tabs.getByRole('tab', { name: 'Técnico', exact: true });
  const client = tabs.getByRole('tab', { name: 'Cliente', exact: true });
  await manager.focus();
  await expect(manager).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('ArrowRight');
  await expect(technician).toBeFocused();
  await expect(technician).toHaveAttribute('aria-selected', 'true');
  const panel = page.getByRole('tabpanel');
  await expect(panel).toHaveCount(1);
  await expect(panel).toHaveAccessibleName('Técnico');
  await page.keyboard.press('Tab');
  await expect(panel).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { name: 'Simular registro' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(panel.getByText('3 fotos vinculadas', { exact: true })).toBeVisible();
  await expect(panel.getByRole('status')).toContainText('Nenhum arquivo foi enviado');
  await panel.getByRole('button', { name: 'Reiniciar simulação' }).click();
  await expect(panel.getByText('2 fotos vinculadas', { exact: true })).toBeVisible();
  await technician.focus();
  await page.keyboard.press('End');
  await expect(client).toBeFocused();
  await panel.getByRole('button', { name: 'Simular validação' }).click();
  await expect(panel.getByText('Solução validada pelo cliente', { exact: true })).toBeVisible();
  await client.focus();
  await page.keyboard.press('ArrowRight');
  await expect(manager).toBeFocused();
  await panel.getByRole('button', { name: 'Simular distribuição' }).click();
  await expect(panel.getByText('Atribuído a João · Técnico', { exact: true })).toBeVisible();
  await manager.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(client).toBeFocused();
  await expect(panel.getByText('Solução aguardando validação', { exact: true })).toBeVisible();
  await page.keyboard.press('Home');
  await expect(manager).toBeFocused();
});

test('all twelve chapters are prerendered and readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  for (const id of [
    'inicio',
    'beneficios',
    'prazos',
    'contratos',
    'como-funciona',
    'plataforma',
    'evidencias',
    'historico',
    'perfis',
    'celular',
    'faq',
    'disponibilidade',
  ]) {
    const chapter = page.locator('#' + id);
    await expect(chapter).toBeVisible();
    await expect(chapter.locator('h1,h2').first()).toBeVisible();
  }
  await expect(page.locator('#faq details')).toHaveCount(6);
  await expect(page.locator('app-hero-background img')).toBeVisible();
  await expect(page.locator('#prazos .deadline-hold')).toHaveCSS('position', 'static');
  await context.close();
});

test('desktop deadline scene follows scrolling and becomes static with reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const scene = page.locator('#prazos');
  const newAction = page.locator('#disponibilidade button');
  await expect(newAction).toHaveCSS('transition-duration', '0.14s');
  await expect(newAction).toHaveCSS('transition-property', 'transform, background-color, color');
  await expect(scene.locator('.deadline-hold')).toHaveCSS('position', 'sticky');
  const geometry = await scene.evaluate((el) => {
    const track = el.querySelector('.deadline-track')!.getBoundingClientRect();
    const icons = el.querySelectorAll('.deadline-icon');
    const first = icons[0].getBoundingClientRect();
    const last = icons[2].getBoundingClientRect();
    return {
      start: track.left - (first.left + first.width / 2),
      end: track.right - (last.left + last.width / 2),
    };
  });
  expect(Math.abs(geometry.start)).toBeLessThan(2);
  expect(Math.abs(geometry.end)).toBeLessThan(2);
  const bounds = await scene.evaluate((el) => ({
    top: el.getBoundingClientRect().top + scrollY,
    height: el.getBoundingClientRect().height,
  }));
  expect(bounds.height).toBeLessThanOrEqual(1800);
  await page.evaluate(
    (bounds) => scrollTo({ top: bounds.top + bounds.height - innerHeight, behavior: 'instant' }),
    bounds,
  );
  await expect(scene.locator('[data-stage="2"]')).toHaveClass(/current/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(newAction).toHaveCSS('transition-duration', '0s');
  await expect(scene.locator('.deadline-hold')).toHaveCSS('position', 'static');
  await expect(scene.locator('li')).toHaveCount(3);
  expect(errors).toEqual([]);
});

test('closing availability dialog returns focus to its trigger', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const trigger = page
    .locator('#disponibilidade')
    .getByRole('button', { name: 'Sobre a disponibilidade' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Estamos construindo a Nivelo' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Entendi' }).click();
  await expect(trigger).toBeFocused();
});
