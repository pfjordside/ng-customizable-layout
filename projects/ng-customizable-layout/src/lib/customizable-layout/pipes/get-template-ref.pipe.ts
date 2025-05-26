import { Pipe, PipeTransform } from '@angular/core';
import { TemplateMap } from '../model/template-map.interface';

@Pipe({
  name: 'getTemplateRef',
  standalone: true,
})
export class GetTemplateRefPipe implements PipeTransform {
  transform(templateName: string, templateMap?: TemplateMap) {
    return templateMap?.[templateName];
  }
}
