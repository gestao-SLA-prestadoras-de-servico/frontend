import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card.directive';

@Component({
  standalone: true,
  imports: [Card],
  template: `
    <article id="benefit" appCard="benefit" class="text-ink">Benefit</article>
    <article id="feature" appCard="feature">Feature</article>
    <article id="role" appCard="role">Role</article>
  `,
})
class CardHost {}

describe('Card directive', () => {
  let fixture: ComponentFixture<CardHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardHost] }).compileComponents();
    fixture = TestBed.createComponent(CardHost);
    fixture.detectChanges();
  });

  it('keeps the article element and local classes while applying the benefit rule', () => {
    const card = fixture.nativeElement.querySelector('#benefit') as HTMLElement;

    expect(card.tagName).toBe('ARTICLE');
    expect(card.classList.contains('text-ink')).toBe(true);
    expect(card.classList.contains('border-t')).toBe(true);
    expect(card.classList.contains('border-line2')).toBe(true);
    expect(card.classList.contains('pt-[22px]')).toBe(true);
  });

  it('preserves the platform feature and role variants', () => {
    const feature = fixture.nativeElement.querySelector('#feature') as HTMLElement;
    const role = fixture.nativeElement.querySelector('#role') as HTMLElement;

    expect(feature.classList.contains('border-line')).toBe(true);
    expect(feature.classList.contains('lg:first:border-t-0')).toBe(true);
    expect(feature.classList.contains('sm:pb-6')).toBe(true);
    expect(role.classList.contains('border-line2')).toBe(true);
    expect(role.classList.contains('pt-6')).toBe(true);
  });
});
