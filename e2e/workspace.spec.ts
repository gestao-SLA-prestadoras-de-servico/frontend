import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration, waitForHydration } from './helpers/hydration';

const profiles = [
  {
    key: 'gestor',
    label: 'Gestor',
    name: 'Camila Moreira',
    heading: 'Painel de operações',
    links: [
      'Painel',
      'Fila de chamados',
      'Relatórios',
      'Contratos',
      'Políticas SLA',
      'Empresas',
      'Usuários',
      'Auditoria',
    ],
    count: 3,
  },
  {
    key: 'tecnico',
    label: 'Técnico',
    name: 'Rafael Costa',
    heading: 'Meus chamados',
    links: ['Meus chamados', 'Atendimento atual'],
    count: 2,
  },
  {
    key: 'cliente',
    label: 'Cliente',
    name: 'Marina Alves',
    heading: 'Meus chamados',
    links: ['Meus chamados', 'Abrir chamado'],
    count: 4,
  },
] as const;

for (const profile of profiles) {
  test(`${profile.label} has a complete shell and navigable example areas`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoAndWaitForHydration(page, `/app/${profile.key}`);
    await expect(page.getByRole('heading', { name: profile.heading, exact: true })).toBeFocused();
    await expect(page.getByLabel('Perfil de demonstração')).toHaveValue(profile.key);
    await expect(page.getByRole('button', { name: `Menu de ${profile.name}` })).toBeVisible();
    const nav = page.getByRole('navigation', { name: `Navegação da área de ${profile.label}` });
    await expect(nav.getByRole('link')).toHaveCount(profile.links.length);
    await expect(nav.getByRole('link').first()).toHaveAttribute('aria-current', 'page');
    if (profile.key === 'tecnico') {
      await expect(page.locator('app-technician-ticket-card')).toHaveCount(profile.count);
    } else if (profile.key === 'gestor') {
      await expect(page.locator('app-manager-dashboard article')).toHaveCount(profile.count);
    } else {
      await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(profile.count);
    }
    for (const label of profile.links.slice(1)) {
      await nav.getByRole('link', { name: label, exact: true }).click();
      await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute(
        'aria-current',
        'page',
      );
      await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText(label);
      await expect(page.locator('main h1')).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440);
    }
    if (profile.key === 'cliente')
      await expect(page.getByRole('button', { name: /^Notificações de demonstração/ })).toHaveCount(
        0,
      );
    if (profile.key === 'tecnico') {
      await expect(page.locator('main')).not.toContainText('CT-2026-014');
      await expect(nav).not.toContainText('Contratos');
    }
  });
}

test('profile selection navigates directly between fictional contexts without authentication', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' || ['fetch', 'xhr'].includes(request.resourceType()))
      requests.push(request.url());
  });
  await gotoAndWaitForHydration(page, '/app/gestor');
  for (const profile of [profiles[1], profiles[2], profiles[0]]) {
    await page.getByLabel('Perfil de demonstração').selectOption(profile.key);
    await expect(page).toHaveURL(new RegExp(`/app/${profile.key}$`));
    await expect(page.getByRole('heading', { name: profile.heading, exact: true })).toBeFocused();
    await expect(page.getByRole('button', { name: `Menu de ${profile.name}` })).toBeVisible();
  }
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

for (const width of [320, 390, 768]) {
  test(`mobile navigation traps focus, closes, and follows links at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await gotoAndWaitForHydration(page, '/app/gestor');
    const trigger = page.getByRole('button', { name: 'Abrir navegação' });
    await trigger.click();
    const menu = page.getByRole('dialog', { name: 'Área de Gestor' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Fechar navegação' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(menu.getByRole('link', { name: 'NIVELO, voltar ao site' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(menu.getByRole('link', { name: 'Sobre a demonstração' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(menu.getByRole('link', { name: 'NIVELO, voltar ao site' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await menu.getByRole('link', { name: 'Políticas SLA' }).click();
    await expect(menu).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Políticas SLA', exact: true })).toBeFocused();
    await trigger.click();
    await page.mouse.click(width - 2, 400);
    await expect(menu).not.toBeVisible();
    await trigger.click();
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(menu).not.toBeVisible();
    await expect(page.getByLabel('Perfil de demonstração')).toBeFocused();
    expect(
      await page.evaluate(
        () =>
          document.body.scrollHeight > 0 && getComputedStyle(document.body).overflow !== 'hidden',
      ),
    ).toBe(true);
  });
}

test('all profiles fit desktop, tablet, phone and short viewports', async ({ page }) => {
  for (const size of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 600 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(size);
    for (const profile of profiles) {
      await gotoAndWaitForHydration(page, `/app/${profile.key}`);
      await expect(page.locator('main h1')).toBeFocused();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${profile.label} ${size.width}`,
      ).toBe(size.width);
      await expect(page.getByLabel('Perfil de demonstração')).toBeVisible();
      if (size.width < 1024)
        await expect(page.getByRole('complementary', { name: 'Menu lateral' })).toBeHidden();
    }
  }
});

test('notifications, keyboard skip link, user menu and expired session work locally', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/gestor');
  const bell = page.getByRole('button', { name: /^Notificações de demonstração/ });
  await bell.click();
  await expect(page.getByRole('region', { name: 'Notificações de demonstração' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(bell).toBeFocused();
  await page.getByRole('link', { name: 'Pular para o conteúdo' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#workspace-content')).toBeFocused();
  await page.getByRole('button', { name: 'Menu de Camila Moreira' }).click();
  await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL(/\/login\?estado=saida$/);
  await gotoAndWaitForHydration(page, '/app/tecnico');
  await page.getByRole('button', { name: 'Menu de Rafael Costa' }).click();
  await page.getByRole('menuitem', { name: 'Simular sessão expirada' }).click();
  await expect(page).toHaveURL(/\/sessao-expirada$/);
});

test('not-found pages preserve the profile and offer a working return path', async ({ page }) => {
  for (const profile of profiles) {
    const response = await page.goto(`/app/${profile.key}/pagina-inexistente`);
    await waitForHydration(page);
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: 'Página não encontrada', exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel('Perfil de demonstração')).toHaveValue(profile.key);
    await page.getByRole('link', { name: 'Voltar ao início da área' }).click();
    await expect(page).toHaveURL(new RegExp(`/app/${profile.key}$`));
  }
  await gotoAndWaitForHydration(page, '/pagina-inexistente');
  await expect(
    page.getByRole('heading', { name: 'Página não encontrada', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao site', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('profile pages render their content without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const profile of profiles) {
    await page.goto(`/app/${profile.key}`);
    await expect(page.getByRole('heading', { name: profile.heading, exact: true })).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: `Navegação da área de ${profile.label}` }),
    ).toBeVisible();
  }
  await context.close();
});
