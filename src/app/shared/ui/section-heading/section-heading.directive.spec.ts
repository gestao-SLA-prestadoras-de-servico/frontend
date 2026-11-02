import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionHeading } from './section-heading.directive';

@Component({
  standalone: true,
  imports: [SectionHeading],
  template: `
    <h2 id="responsive" appSectionHeading="responsive" class="text-cyan">Responsive</h2>
    <h2 id="inverse" appSectionHeading="inverse">Inverse</h2>
    <h2 id="prominent" appSectionHeading="prominent">Prominent</h2>
  `,
})
class SectionHeadingHost {}

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
    expect(heading.classList.contains('text-cyan')).toBe(true);
    expect(heading.classList.contains('text-[1.85rem]')).toBe(true);
    expect(heading.classList.contains('sm:text-[clamp(2rem,5.4vw,3.375rem)]')).toBe(true);
  });

  it('applies the inverse and prominent section heading variants', () => {
    const inverse = fixture.nativeElement.querySelector('#inverse') as HTMLHeadingElement;
    const prominent = fixture.nativeElement.querySelector('#prominent') as HTMLHeadingElement;

    expect(inverse.classList.contains('text-white')).toBe(true);
    expect(prominent.classList.contains('text-[clamp(1.875rem,3vw,2.875rem)]')).toBe(true);
  });
});
