# ng-customizable-layout

Customizable layout component for Angular

## Getting started

### 1. Import the module

```ts
@NgModule({
  ...
  imports: [CommonModule, CustomizableLayoutModule]
  ...
})
export class SomeModule {}
```

### 2. Create default layout config

Example: Layout with a single column on mobile, two columns on tablet

```ts
export const defaultLayout: CustomizableLayoutConfig = {
  version: 1, // Increment this to enforce a new default layout on all consuming clients
  name: "LAYOUT_NAME",
  [LayoutType.Mobile]: {
    cardMargin: "0.5rem",
    lists: [
      {
        width: "1fr",
        containerName: "single-col-mobile",
        items: [
          {
            componentName: "Component_1",
          },
          {
            componentName: "Component_2",
          },
          {
            componentName: "Component_3",
          },
        ],
      },
    ],
  },
  [LayoutType.Tablet]: {
    cardMargin: "1rem",
    lists: [
      {
        width: "2fr",
        containerName: "col0",
        items: [
          {
            componentName: "Component_1",
          },
          {
            componentName: "Component_2",
          },
        ],
      },
      {
        width: "1fr",
        containerName: "col1",
        items: [
          {
            componentName: "Component_3",
          },
        ],
      },
    ],
  },
};
```

### 3. Setup layout host component

```ts
@Component({
  selector: "app-some-layout-component",
  template: "./some-layout-component.component.html",
  styleUrls: ["./some-layout-component.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListsComponent {
  readonly defaultLayout = defaultLayout;
  editing: boolean;

  componentsMap: ComponentMap = {
    ["Component_1"]: { component: Component_1 },
    ["Component_2"]: { component: Component_1 },
    ["Component_3"]: { component: Component_1, hidden: someCondition },
  };
}
```

### 4. Use ng-customizable-layout in template

```html
<ng-customizable-layout
  #layout
  [editing]="editing"
  [componentMap]="componentsMap"
  [defaultLayout]="defaultLayout"
>
</ng-customizable-layout>
```

Happy coding :)
