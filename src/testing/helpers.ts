import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

export type MatchMediaStub = EventTarget & { matches: boolean };

export function stubMatchMedia(matches = false): MatchMediaStub {
  const query = Object.assign(new EventTarget(), { matches });
  vi.stubGlobal('matchMedia', () => query);
  return query;
}

export interface IntersectionObserverStub {
  trigger: (isIntersecting: boolean) => void;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

export function stubIntersectionObserver(): IntersectionObserverStub {
  let callback: IntersectionObserverCallback = () => undefined;
  const observe = vi.fn();
  const disconnect = vi.fn();

  class IntersectionObserverMock {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];

    constructor(cb: IntersectionObserverCallback) {
      callback = cb;
    }

    observe = observe;
    unobserve = vi.fn();
    disconnect = disconnect;
    takeRecords = () => [];
  }

  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

  return {
    trigger: (isIntersecting) =>
      callback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver),
    observe,
    disconnect,
  };
}

const dialogPrototype = HTMLDialogElement.prototype as unknown as Record<string, unknown>;
const originalShowModal = dialogPrototype['showModal'];
const originalClose = dialogPrototype['close'];

export function stubDialogElement(): void {
  dialogPrototype['showModal'] = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  dialogPrototype['close'] = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

export function restoreDialogElement(): void {
  if (originalShowModal === undefined) delete dialogPrototype['showModal'];
  else dialogPrototype['showModal'] = originalShowModal;

  if (originalClose === undefined) delete dialogPrototype['close'];
  else dialogPrototype['close'] = originalClose;
}

export interface RenderedComponent<T> {
  fixture: ComponentFixture<T>;
  element: HTMLElement;
}

export async function renderComponent<T>(component: Type<T>): Promise<RenderedComponent<T>> {
  await TestBed.configureTestingModule({ imports: [component] }).compileComponents();
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

export function resetTestEnvironment(): void {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  restoreDialogElement();
}
