import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Link } from './link.directive';

@Component({
  standalone: true,
  imports: [Link],
  template: `
    <a id="navigation" appLink class="text-pri" href="#section">Navigation</a>
    <a id="menu" appLink="menu" href="#section">Menu</a>
    <a id="footer" appLink="footer" href="#inicio">Footer</a>
  `,
})
class LinkHost {}

describe('Link directive', () => {
  let fixture: ComponentFixture<LinkHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LinkHost] }).compileComponents();
    fixture = TestBed.createComponent(LinkHost);
    fixture.detectChanges();
  });

  it('applies the desktop navigation style by default and preserves native link attributes', () => {
    const link = fixture.nativeElement.querySelector('#navigation') as HTMLAnchorElement;

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#section');
    expect(link.classList.contains('text-pri')).toBe(true);
    expect(link.classList.contains('min-h-11')).toBe(true);
    expect(link.classList.contains('whitespace-nowrap')).toBe(true);
    expect(link.classList.contains('hover:underline')).toBe(true);
  });

  it('applies the larger touch target and separators to mobile menu links', () => {
    const link = fixture.nativeElement.querySelector('#menu') as HTMLAnchorElement;

    expect(link.classList.contains('min-h-14')).toBe(true);
    expect(link.classList.contains('justify-between')).toBe(true);
    expect(link.classList.contains('border-t')).toBe(true);
    expect(link.classList.contains('border-line')).toBe(true);
    expect(link.classList.contains('text-lg')).toBe(true);
  });

  it('applies the footer link style', () => {
    const link = fixture.nativeElement.querySelector('#footer') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('#inicio');
    expect(link.classList.contains('min-h-11')).toBe(true);
    expect(link.classList.contains('gap-[18px]')).toBe(true);
    expect(link.classList.contains('hover:text-white')).toBe(true);
  });
});
