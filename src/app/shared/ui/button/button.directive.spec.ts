import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button, ButtonPrimary, ButtonSecondary } from './button.directive';

@Component({
  standalone: true,
  imports: [Button, ButtonPrimary, ButtonSecondary],
  template: `
    <a id="base" appButton class="fixed">Base</a>
    <a id="primary" appButtonPrimary class="min-h-12">Primário</a>
    <button id="secondary" appButtonSecondary class="w-full">Secundário</button>
    <button id="inverse" appButtonSecondary="inverse">Secundário sobre fundo escuro</button>
  `,
})
class ButtonHost {}

describe('Button directives', () => {
  let fixture: ComponentFixture<ButtonHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonHost] }).compileComponents();
    fixture = TestBed.createComponent(ButtonHost);
    fixture.detectChanges();
  });

  it('applies the base and variant classes while keeping native elements and local classes', () => {
    const base = fixture.nativeElement.querySelector('#base') as HTMLAnchorElement;
    const primary = fixture.nativeElement.querySelector('#primary') as HTMLAnchorElement;
    const secondary = fixture.nativeElement.querySelector('#secondary') as HTMLButtonElement;
    const inverse = fixture.nativeElement.querySelector('#inverse') as HTMLButtonElement;

    expect(base.tagName).toBe('A');
    expect(base.classList.contains('fixed')).toBe(true);
    expect(base.classList.contains('group/action')).toBe(true);

    expect(primary.classList.contains('min-h-12')).toBe(true);
    expect(primary.classList.contains('border-transparent')).toBe(true);
    expect(primary.classList.contains('bg-pri')).toBe(true);

    expect(secondary.tagName).toBe('BUTTON');
    expect(secondary.classList.contains('w-full')).toBe(true);
    expect(secondary.classList.contains('border-line2')).toBe(true);
    expect(secondary.classList.contains('text-navy')).toBe(true);

    expect(inverse.classList.contains('border-[#b0c3dc]')).toBe(true);
    expect(inverse.classList.contains('text-white')).toBe(true);
  });
});
