import { CustomizableLayout } from "./customizable-layout.interface";
import { LayoutType } from "./layout-type.enum";

export interface CustomizableLayoutConfig {
  /**
   * The name of this layout, must be unique
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
