import { Pipe, PipeTransform } from '@angular/core';
import { LayoutElement } from '../model/layout-element.interface';

@Pipe({
  name: 'withoutHidden',
  standalone: true,
})
export class WithoutHiddenPipe implements PipeTransform {
  transform(arr: LayoutElement[]): LayoutElement[] {
    return arr.filter((v) => !v.hidden) ?? arr;
  }
}
