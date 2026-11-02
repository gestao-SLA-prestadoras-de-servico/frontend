import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionHeading } from './section-heading.directive';

@Component({
  standalone: true,
  imports: [SectionHeading],
  template: `
    <h2 id="responsive" appSectionHeading class="max-w-[11em]">Responsive</h2>
    <h2 id="changing" [appSectionHeading]="variant()" class="underline">Changing</h2>
  `,
})
class SectionHeadingHost {
  readonly variant = signal<'responsive' | 'statement' | 'history'>('responsive');
}

describe('SectionHeading directive', () => {
  let fixture: ComponentFixture<SectionHeadingHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SectionHeadingHost] }).compileComponents();
    fixture = TestBed.createComponent(SectionHeadingHost);
    fixture.detectChanges();
  });

  it('preserves the native heading and local classes while applying the responsive variant', () => {
    const heading = fixture.nativeElement.querySelector('#responsive') as HTMLHeadingElement;

    expect(heading.tagName).toBe('H2');
    expect(heading.classList.contains('max-w-[11em]')).toBe(true);
    expect(heading.classList.contains('font-[550]')).toBe(true);
    expect(heading.classList.contains('md:text-[clamp(2.2rem,4.5vw,4.4rem)]')).toBe(true);
  });

  it('replaces variant classes reactively while keeping native semantics and local classes', () => {
    const heading = fixture.nativeElement.querySelector('#changing') as HTMLHeadingElement;
    fixture.componentInstance.variant.set('statement');
    fixture.detectChanges();
    expect(heading.classList.contains('text-white')).toBe(true);
    expect(heading.classList.contains('max-w-[17ch]')).toBe(true);
    expect(heading.classList.contains('md:text-[clamp(2.2rem,4.5vw,4.4rem)]')).toBe(false);

    fixture.componentInstance.variant.set('history');
    fixture.detectChanges();
    expect(heading.tagName).toBe('H2');
    expect(heading.classList.contains('underline')).toBe(true);
    expect(heading.classList.contains('font-[550]')).toBe(true);
    expect(heading.classList.contains('text-white')).toBe(false);
    expect(heading.classList.contains('max-w-[17ch]')).toBe(false);
    expect(heading.classList.contains('text-[clamp(2.2rem,3.6vw,3.5rem)]')).toBe(true);
  });
});
