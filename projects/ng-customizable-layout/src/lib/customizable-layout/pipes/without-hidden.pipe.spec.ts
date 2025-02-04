import { TemplateRef } from '@angular/core';
import { LayoutElement } from '../model/layout-element.interface';
import { WithoutHiddenPipe } from './without-hidden.pipe';

const mockTemplateRef: TemplateRef<any> = {} as TemplateRef<any>;

describe('WithoutHiddenPipe', () => {
  let pipe: WithoutHiddenPipe;

  beforeEach(() => {
    pipe = new WithoutHiddenPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter out hidden elements', () => {
    const elements: LayoutElement[] = [
      { templateRef: mockTemplateRef, hidden: false },
      { templateRef: mockTemplateRef, hidden: true },
      { templateRef: mockTemplateRef, hidden: false },
    ];
    const result = pipe.transform(elements);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { templateRef: mockTemplateRef, hidden: false },
      { templateRef: mockTemplateRef, hidden: false },
    ]);
  });

  it('should return an empty array if all elements are hidden', () => {
    const elements: LayoutElement[] = [
      { templateRef: mockTemplateRef, hidden: true },
      { templateRef: mockTemplateRef, hidden: true },
    ];
    const result = pipe.transform(elements);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });

  it('should return the same array if no elements are hidden', () => {
    const elements: LayoutElement[] = [
      { templateRef: mockTemplateRef, hidden: false },
      { templateRef: mockTemplateRef, hidden: false },
    ];
    const result = pipe.transform(elements);
    expect(result.length).toBe(2);
    expect(result).toEqual(elements);
  });
});
