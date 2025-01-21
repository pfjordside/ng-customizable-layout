import { ComponentMap } from '../model/component-map.interface';
import { LayoutElement } from '../model/layout-element.interface';
import { WithoutHiddenPipe } from './without-hidden.pipe';

describe('WithoutHiddenPipe', () => {
  let pipe: WithoutHiddenPipe;

  beforeEach(() => {
    pipe = new WithoutHiddenPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform with array and componentMap', () => {
    let array: LayoutElement[];
    let componentMap: ComponentMap;
    beforeEach(() => {
      array = [{ componentName: 'SomeComponent' }, { componentName: 'SomeOtherComponent' }];
      componentMap = {
        ['SomeOtherComponent']: {
          component: 'SomeOtherComponent' as any,
          hidden: true,
        },
      };
    });

    it('should filter input array using provided filter function', () => {
      const res = pipe.transform(array, componentMap);
      expect(res.length).toBe(1);
      expect(res[0].componentName).toEqual('SomeComponent');
    });

    it('should return input array if no componentMap provided', () => {
      const res = pipe.transform(array, {});
      expect(res.length).toBe(2);
    });
  });
});
