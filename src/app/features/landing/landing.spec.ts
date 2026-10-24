import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Landing } from './landing';

describe('Landing', () => {
  let fixture: ComponentFixture<Landing>;
  let page: HTMLElement;
  const dialogPrototype = HTMLDialogElement.prototype as unknown as Record<string, unknown>;

  beforeEach(async () => {
    dialogPrototype['showModal'] = function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    dialogPrototype['close'] = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };

    await TestBed.configureTestingModule({ imports: [Landing] }).compileComponents();

    fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    await fixture.whenStable();
    page = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    fixture.destroy();
    delete dialogPrototype['showModal'];
    delete dialogPrototype['close'];
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
