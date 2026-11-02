import { ComponentFixture } from '@angular/core/testing';
import {
  renderComponent,
  resetTestEnvironment,
  stubDialogElement,
  stubMatchMedia,
} from '@testing/helpers';
import { Landing } from './landing';

describe('Landing', () => {
  let fixture: ComponentFixture<Landing>;
  let page: HTMLElement;

  beforeEach(async () => {
    stubDialogElement();
    stubMatchMedia();
    const rendered = await renderComponent(Landing);
    fixture = rendered.fixture;
    page = rendered.element;
  });

  afterEach(() => {
    fixture.destroy();
    resetTestEnvironment();
  });

  it('should create the landing page', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the main sections and the FAQ', () => {
    expect(page.querySelector('h1')?.textContent).toContain('Prazos sob controle.');
    expect(page.querySelector('h1')?.textContent).toContain('Atendimento comprovado.');
    expect(page.querySelector('#inicio')).not.toBeNull();
    expect(page.querySelector('#beneficios')).not.toBeNull();
    expect(page.querySelector('#como-funciona')).not.toBeNull();
    expect(page.querySelector('#plataforma')).not.toBeNull();
    expect(page.querySelector('#faq')).not.toBeNull();
    expect(page.querySelector('app-product-preview')).not.toBeNull();
    expect(page.querySelectorAll('#faq details')).toHaveLength(6);
  });

  it('should open and close the mobile menu', () => {
    const menu = page.querySelector<HTMLDialogElement>('#mobile-menu');
    const menuButton = page.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]');

    menuButton?.click();
    fixture.detectChanges();
    expect(menu?.open).toBe(true);

    page.querySelector<HTMLButtonElement>('[aria-label="Fechar menu"]')?.click();
    fixture.detectChanges();
    expect(menu?.open).toBe(false);
  });

  it('should return focus to the menu trigger after closing the mobile menu', () => {
    const menuButton = page.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]');

    menuButton?.click();
    fixture.detectChanges();
    page.querySelector<HTMLButtonElement>('[aria-label="Fechar menu"]')?.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(menuButton);
  });

  it('should close the mobile menu and focus the target section when following an anchor', () => {
    const menu = page.querySelector<HTMLDialogElement>('#mobile-menu');
    page.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]')?.click();
    fixture.detectChanges();

    const link = page.querySelector<HTMLAnchorElement>('#mobile-menu a[href="#beneficios"]');
    link?.addEventListener('click', (event) => event.preventDefault());
    link?.click();
    fixture.detectChanges();

    expect(menu?.open).toBe(false);
    expect(document.activeElement).toBe(page.querySelector('#beneficios'));
  });

  it('should open the availability dialog from the hero and restore focus on close', () => {
    const trigger = page.querySelector<HTMLButtonElement>('#inicio button');
    const dialog = page.querySelector<HTMLDialogElement>('app-availability-dialog dialog');

    trigger?.click();
    fixture.detectChanges();
    expect(dialog?.open).toBe(true);

    page
      .querySelector<HTMLButtonElement>('app-availability-dialog [aria-label="Fechar aviso"]')
      ?.click();
    fixture.detectChanges();
    expect(dialog?.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
});
