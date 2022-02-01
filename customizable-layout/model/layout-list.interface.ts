import { LayoutElement } from "./layout-element.interface";

export interface LayoutList {
  containerName: string;
  connectedTo?: string[];
  cards: LayoutElement[];
  width: string;
}
