import { LayoutElement } from './layout-element.interface';

export interface LayoutList {
  containerName: string; // Must be unique
  connectedTo?: string[];
  items: LayoutElement[];
  width: string;
}
