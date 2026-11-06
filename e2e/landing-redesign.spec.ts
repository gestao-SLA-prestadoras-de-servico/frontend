import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('profiles support keyboard selection, local simulations and resets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoAndWaitForHydration(page, '/');
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
  await expect(page.locator('.opening-person img')).toBeVisible();
  await expect(page.locator('#prazos .poster-print')).toHaveCount(3);
  await context.close();
});

test('the three deadline posters follow scrolling and become static with reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await gotoAndWaitForHydration(page, '/');
  await page.evaluate(() => document.fonts.ready);
  const scene = page.locator('#prazos');
  await expect(scene.locator('.poster-print')).toHaveCount(3);
  const first = scene.locator('.poster-print').first();
  await expect(first).toHaveAttribute('data-motion-active', '');
  const top = await scene.evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), top - 650);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const initial = await first.evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), top + 600);
  await expect.poll(() => first.evaluate((el) => getComputedStyle(el).transform)).not.toBe(initial);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const poster of await scene.locator('.poster-print').all())
    await expect(poster).toHaveCSS('transform', 'none');
});

test('closing availability dialog returns focus to its trigger', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoAndWaitForHydration(page, '/');
  const trigger = page
    .locator('#disponibilidade')
    .getByRole('button', { name: 'Sobre a disponibilidade' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Estamos construindo a Nivelo' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Entendi' }).click();
  await expect(trigger).toBeFocused();
});
