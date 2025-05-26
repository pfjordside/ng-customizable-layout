import { CustomizableLayout } from "./customizable-layout.interface";
import { LayoutType } from "./layout-type.enum";

export interface CustomizableLayoutConfig {
  /**
   * The name of this layout
   * Used to persist in localStorage, must be unique
   */
  name: string;
  /**
   * Layout version number
   * Increment this to reset users layout, when adding new elements or enforcing a new default layout 
   */
  version: number;
  [LayoutType.Desktop]?: CustomizableLayout;
  [LayoutType.Tablet]?: CustomizableLayout;
  [LayoutType.Mobile]: CustomizableLayout; 
}

export function isCustomizableLayoutConfig(obj: any): obj is CustomizableLayoutConfig {
  return obj?.version && obj?.name;
}
