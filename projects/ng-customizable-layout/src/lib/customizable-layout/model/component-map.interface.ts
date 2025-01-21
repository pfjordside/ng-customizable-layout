import { Type } from '@angular/core';

export interface ComponentMap {
  [key: string]: { component: Type<any>; hidden?: boolean };
}
