import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform<T>(arr: T[], filterFn: (element: T) => boolean): T[] {
    return typeof filterFn === 'function' ? arr?.filter(v => filterFn(v)) : arr;
  }
}
