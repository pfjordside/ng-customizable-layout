# CustomizableLayoutComponent 🧱

A standalone Angular component for building customizable, drag-and-drop layouts. Part of the [ng-customizable-layout](../../README.md) library.

## ✨ Features

- 🖱️ Drag-and-drop cards between columns
- 📱 Responsive breakpoints (Desktop, Tablet, Mobile)
- 💾 User-editable layout with persistent storage
- 🎨 Easy integration with Angular Material

## 🚀 Quick Start

1. **Import the component**

   ```typescript
   import { CustomizableLayoutComponent } from 'ng-customizable-layout';
   ```

2. **Add to your template**

   ```html
   <ng-customizable-layout
     [layoutConfig]="layoutConfig"
     [templateMap]="{ cardTemplate, otherCardTemplate }"
     [editing]="editing()"
   ></ng-customizable-layout>
   ```

3. **Provide a layout config**

   ```typescript
   import { CustomizableLayoutConfig, LayoutType } from 'ng-customizable-layout';

   layoutConfig: CustomizableLayoutConfig = {
     version: 1,
     name: 'Demo Layout',
     [LayoutType.Mobile]: { ... },
     [LayoutType.Tablet]: { ... },
     [LayoutType.Desktop]: { ... },
   };
   ```

4. **Provide templates for your cards**

   ```html
   <ng-template #cardTemplate>
     <mat-card>
       <mat-card-header>
         <mat-card-title>Drag me! 🚚</mat-card-title>
       </mat-card-header>
       <mat-card-content>
         <!-- Card content here -->
       </mat-card-content>
     </mat-card>
   </ng-template>
   ```

## 🛠️ Inputs

- `layoutConfig`: The layout configuration object
- `templateMap`: A map of template references for card types
- `editing`: Boolean, enables editing mode

## 📤 Outputs

- `layoutChanged`: Emits when the layout changes

## 🔗 See Also

- [CustomizableLayoutMenuComponent](../customizable-layout-menu/)
- [Demo app](../../../demo-app/)

---

MIT License ©️
