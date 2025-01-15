import { Type } from '@angular/core';

export interface LayoutElement {
  component: Type<any>;
  hidden?: boolean;
}
