import { CustomizableLayout } from "./customizable-layout.interface";
import { LayoutType } from "./layout-type.enum";

export interface CustomizableLayoutConfig {
  [LayoutType.Desktop]?: CustomizableLayout;
  [LayoutType.Tablet]?: CustomizableLayout;
  [LayoutType.Mobile]: CustomizableLayout;
  persist: boolean;
  name: string;
}
