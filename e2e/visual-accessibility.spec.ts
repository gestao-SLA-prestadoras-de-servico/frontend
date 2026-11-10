import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('internal pages keep their layout and field labels across device widths', async ({ page }) => {
  const routes = [
    'gestor',
    'gestor/chamados',
    'gestor/chamados/1042',
    'gestor/relatorios',
    'gestor/auditoria',
    'gestor/contratos',
    'gestor/politicas',
    'gestor/empresas',
    'gestor/usuarios',
    'tecnico',
    'tecnico/chamados/1042',
    'cliente',
    'cliente/novo-chamado',
    'cliente/chamados/1042',
  ];
  const widths = [320, 390, 768, 1440];
  for (const route of routes) {
    await page.setViewportSize({ width: widths[0], height: 900 });
    await gotoAndWaitForHydration(page, `/app/${route}`);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator('main h1'), route).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${route} ${width}`,
      ).toBe(width);
      const unlabeled = await page
        .locator('main input:not([type=hidden]), main select, main textarea')
        .evaluateAll((elements) =>
          elements
            .filter(
              (element) =>
                element.getClientRects().length &&
                !(element as HTMLInputElement).labels?.length &&
                !element.getAttribute('aria-label') &&
                !element.getAttribute('aria-labelledby'),
            )
            .map((element) => element.outerHTML),
        );
      expect(unlabeled, route).toEqual([]);
    }
  }
});

test('evidence placeholder messages have sufficient text contrast', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoAndWaitForHydration(page, '/app/tecnico/chamados/1042');
  const placeholders = page.locator('app-technician-evidence .bg-poster span');
  await expect(placeholders).toHaveCount(3);
  const ratios = await placeholders.evaluateAll((elements) =>
    elements.map((element) => {
      const rgb = (value: string) =>
        value
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number);
      const luminance = (values: number[]) =>
        values
          .map((value) => {
            const channel = value / 255;
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
      const foreground = luminance(rgb(getComputedStyle(element).color));
      const background = luminance(
        rgb(getComputedStyle(element.closest('.bg-poster')!).backgroundColor),
      );
      return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    }),
  );
  for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
});

test('keyboard focus remains visible on mobile navigation and client fields', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoAndWaitForHydration(page, '/app/cliente/novo-chamado');
  const trigger = page.getByRole('button', { name: 'Abrir navegação' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const close = page.getByRole('button', { name: 'Fechar navegação' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  const contract = page.getByLabel('Contrato', { exact: true });
  await contract.focus();
  await page.keyboard.press('Tab');
  const title = page.getByLabel('Título do chamado');
  await expect(title).toBeFocused();
  const outline = await title.evaluate((element) => ({
    style: getComputedStyle(element).outlineStyle,
    width: parseFloat(getComputedStyle(element).outlineWidth),
  }));
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThanOrEqual(2);
});
