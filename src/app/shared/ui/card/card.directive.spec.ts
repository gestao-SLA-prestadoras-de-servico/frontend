import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card.directive';

@Component({
  standalone: true,
  imports: [Card],
  template: `
    <div id="benefit" appCard class="text-white">Benefit</div>
    <p id="feature" appCard="feature"><strong>Feature</strong>Description</p>
    <figure id="role" appCard="role" data-profile><figcaption>Role</figcaption></figure>
    <article id="changing" [appCard]="variant()" class="mt-8">Changing</article>
  `,
})
class CardHost {
  readonly variant = signal<'feature' | 'role'>('feature');
}

describe('Card directive', () => {
  let fixture: ComponentFixture<CardHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardHost] }).compileComponents();
    fixture = TestBed.createComponent(CardHost);
    fixture.detectChanges();
  });

  it('preserves the native elements, local classes and motion hooks of editorial blocks', () => {
    const benefit = fixture.nativeElement.querySelector('#benefit') as HTMLElement;
    const feature = fixture.nativeElement.querySelector('#feature') as HTMLElement;
    const role = fixture.nativeElement.querySelector('#role') as HTMLElement;

    expect(benefit.tagName).toBe('DIV');
    expect(benefit.classList.contains('text-white')).toBe(true);
    expect(benefit.classList.contains('grid')).toBe(true);
    expect(feature.tagName).toBe('P');
    expect(feature.querySelector('strong')?.textContent).toBe('Feature');
    expect(role.tagName).toBe('FIGURE');
    expect(role.hasAttribute('data-profile')).toBe(true);
    expect(role.querySelector('figcaption')?.textContent).toBe('Role');
  });

  it('replaces variant classes without keeping the previous layout or removing local classes', () => {
    const card = fixture.nativeElement.querySelector('#changing') as HTMLElement;
    fixture.componentInstance.variant.set('role');
    fixture.detectChanges();
    expect(card.classList.contains('grid')).toBe(true);
    expect(card.classList.contains('text-sm')).toBe(false);

    fixture.componentInstance.variant.set('feature');
    fixture.detectChanges();
    expect(card.tagName).toBe('ARTICLE');
    expect(card.classList.contains('mt-8')).toBe(true);
    expect(card.classList.contains('text-sm')).toBe(true);
    expect(card.classList.contains('grid')).toBe(false);
  });
});
