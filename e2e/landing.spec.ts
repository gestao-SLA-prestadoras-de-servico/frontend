import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

for (const width of [320, 390, 768, 1024, 1440, 1536]) {
  test(`landing, menu, dialog and FAQ at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toContainText('Atendimento comprovado.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);

    const menuButton = page.getByRole('button', { name: 'Abrir menu', exact: true });
    const navigation = page.getByRole('navigation', { name: 'Navegação principal', exact: true });
    if (width < 1024) {
      await expect(navigation).toBeHidden();
      await menuButton.focus();
      await page.keyboard.press('Enter');
      const menu = page.locator('#mobile-menu');
      await expect(menu).toBeVisible();
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      await expect(menu.getByRole('link', { name: 'Benefícios', exact: true })).toBeFocused();
      await menu.getByRole('button', { name: 'Fechar menu' }).focus();
      await page.keyboard.press('Shift+Tab');
      await expect(menu.getByRole('button', { name: 'Sobre a disponibilidade' })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(menu.getByRole('button', { name: 'Fechar menu' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(menu).not.toBeVisible();
      await expect(menuButton).toBeFocused();
    } else {
      await expect(navigation).toBeVisible();
      await expect(menuButton).toBeHidden();
    }

    const trigger = page
      .locator('#inicio')
      .getByRole('button', { name: 'Sobre a disponibilidade' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Estamos construindo a Nivelo' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Entendi' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Fechar aviso' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('button', { name: 'Entendi' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();

    const question = page.locator('#faq details').first();
    await question.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(question).toHaveAttribute('open', '');
    await expect(question.locator('p')).toBeVisible();
  });
}

test('skip link takes keyboard users to the main content', async ({ page }) => {
  await page.goto('/');
  const skipLink = page.locator('a[href="#conteudo"]');
  const main = page.locator('#conteudo');

  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(main).toBeFocused();
});

test('mobile navigation follows anchors and closes only at the desktop breakpoint', async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Abrir menu' });
  const menu = page.locator('#mobile-menu');
  await trigger.click();
  await menu.getByRole('link', { name: 'Benefícios', exact: true }).click();
  await expect(menu).not.toBeVisible();
  await expect(page.locator('#beneficios')).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 1023, height: 900 });
  await expect(menu).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(menu).not.toBeVisible();
  await expect(page.locator('[aria-controls="mobile-menu"]')).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('mobile menu closes on backdrop pointer and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Abrir menu' });
  await trigger.focus();
  await page.keyboard.press('Enter');

  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeVisible();
  await page.mouse.click(195, 10);
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('reduced motion keeps the poster and suppresses decorative movement', async ({ page }) => {
  await page.goto('/');
  const background = page.locator('app-hero-background');
  await expect(background).toHaveAttribute('data-video-state', 'poster');
  await expect(background.locator('video')).not.toHaveAttribute('src');
  await expect(background.locator('video')).toBeHidden();
  await expect(background.locator('img')).toBeVisible();
  const action = page.locator('#inicio a[href="#plataforma"]');
  await action.hover();
  await expect(action.locator('app-action-label > span > span').first()).toHaveCSS(
    'transform',
    'none',
  );
  await expect(action.locator('app-action-label > span > span').first()).toHaveCSS(
    'translate',
    'none',
  );
  await expect(action.locator('app-icon')).toHaveCSS('transform', 'none');
  await expect(action.locator('app-icon')).toHaveCSS('rotate', 'none');
});

test('video media errors fall back to the poster', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const background = page.locator('app-hero-background');
  await expect(background.locator('video')).toHaveAttribute('src', 'videos/nivelo-hero-loop.mp4');
  await background.locator('video').evaluate((video) => video.dispatchEvent(new Event('error')));
  await expect(background).toHaveAttribute('data-video-state', 'poster');
  await expect(background.locator('video')).toHaveCSS('opacity', '0');
  await expect(background.locator('img')).toBeVisible();
});

for (const viewport of [
  { width: 390, height: 667 },
  { width: 844, height: 390 },
  { width: 1024, height: 600 },
]) {
  test(`short viewport ${viewport.width}x${viewport.height} keeps the hero actions accessible`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    const action = page.locator('#inicio').getByRole('button', { name: 'Sobre a disponibilidade' });
    await expect(action).toBeInViewport();
    await action.click();
    const dialog = page.getByRole('dialog', { name: 'Estamos construindo a Nivelo' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Entendi' })).toBeInViewport();
  });
}
