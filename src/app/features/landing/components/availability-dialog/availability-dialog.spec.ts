import { ComponentFixture } from '@angular/core/testing';
import { renderComponent, resetTestEnvironment, stubDialogElement } from '@testing/helpers';
import { AvailabilityDialog } from './availability-dialog';

describe('AvailabilityDialog', () => {
  let fixture: ComponentFixture<AvailabilityDialog>;
  let page: HTMLElement;
  let trigger: HTMLButtonElement;

  beforeEach(async () => {
    stubDialogElement();
    const rendered = await renderComponent(AvailabilityDialog);
    fixture = rendered.fixture;
    page = rendered.element;

    trigger = document.createElement('button');
    trigger.textContent = 'Abrir aviso';
    document.body.appendChild(trigger);
  });

  afterEach(() => {
    fixture.destroy();
    trigger.remove();
    resetTestEnvironment();
  });

  it('opens on demand and reports its state', () => {
    const dialog = fixture.componentInstance;

    dialog.open(trigger);
    fixture.detectChanges();

    expect(dialog.isOpen).toBe(true);
    expect(page.querySelector<HTMLDialogElement>('dialog')?.open).toBe(true);
  });

  it('closes from the close button and restores focus to the trigger', () => {
    const dialog = fixture.componentInstance;

    trigger.focus();
    dialog.open(trigger);
    fixture.detectChanges();

    page.querySelector<HTMLButtonElement>('[aria-label="Fechar aviso"]')?.click();
    fixture.detectChanges();

    expect(dialog.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
});
