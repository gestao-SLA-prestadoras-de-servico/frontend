import type { Page } from '@playwright/test';

/** Wait until Angular finishes hydrating the server-rendered app before browser interaction. */
export async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const root = document.querySelector('app-root');
    return !!root && !root.hasAttribute('ngh') && !root.querySelector('[ngh]');
  });
}

export async function gotoAndWaitForHydration(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await waitForHydration(page);
}
