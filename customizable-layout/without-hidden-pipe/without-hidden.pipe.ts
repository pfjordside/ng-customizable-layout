import { Pipe, PipeTransform } from '@angular/core';
import { ComponentMap } from '../model/component-map.interface';
import { LayoutElement } from '../model/layout-element.interface';

@Pipe({
  name: 'withoutHidden',
})
export class WithoutHiddenPipe implements PipeTransform {
  transform(arr: LayoutElement[], componentMap: ComponentMap): LayoutElement[] {
    return arr && componentMap ? arr.filter(v => !componentMap[v.componentName]?.hidden ?? false) : arr;
  }
}
