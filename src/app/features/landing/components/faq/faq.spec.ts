import { ComponentFixture } from '@angular/core/testing';
import { renderComponent } from '@testing/helpers';
import { Faq } from './faq';

describe('Faq', () => {
  let fixture: ComponentFixture<Faq>;
  let page: HTMLElement;

  beforeEach(async () => {
    const rendered = await renderComponent(Faq);
    fixture = rendered.fixture;
    page = rendered.element;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders all questions closed with their content', () => {
    const items = page.querySelectorAll<HTMLDetailsElement>('#faq details');

    expect(items).toHaveLength(6);
    expect(items[0].querySelector('summary')?.textContent).toContain('Para quem é a Nivelo?');
    expect(page.textContent).toContain('O que significa SLA?');
    items.forEach((item) => expect(item.open).toBe(false));
  });

  it('opens and closes an answer through the native details element', () => {
    const item = page.querySelector<HTMLDetailsElement>('#faq details');
    const summary = item?.querySelector('summary');

    summary?.click();
    fixture.detectChanges();
    expect(item?.open).toBe(true);
    expect(item?.querySelector('p')?.textContent).toContain('prestadoras de serviços técnicos');

    summary?.click();
    fixture.detectChanges();
    expect(item?.open).toBe(false);
  });
});
