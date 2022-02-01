import { CustomizableLayout } from "./customizable-layout.interface";

export interface CustomizableLayoutConfig {
  desktop?: CustomizableLayout;
  tablet?: CustomizableLayout;
  mobile: CustomizableLayout;
  persist: boolean;
  name: string;
}
