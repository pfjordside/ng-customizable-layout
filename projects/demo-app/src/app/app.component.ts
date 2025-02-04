import { Component, signal } from '@angular/core';
import { CustomizableLayoutComponent, CustomizableLayoutMenuComponent } from 'ng-customizable-layout';
import { CustomizableLayoutConfig } from '../../../ng-customizable-layout/src/lib/customizable-layout/model/customizable-layout-config.interface';
import { LayoutType } from '../../../ng-customizable-layout/src/lib/customizable-layout/model/layout-type.enum';
import { DemoComponent } from './demo/demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomizableLayoutComponent, CustomizableLayoutMenuComponent, DemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  editing = signal(false);
  demoComponent = DemoComponent;
  layoutConfig: CustomizableLayoutConfig = {
    version: 1,
    name: 'Demo Layout',
    [LayoutType.Mobile]: {
      cardMargin: '0.5rem',
      lists: [
        {
          width: '1fr',
          containerName: 'List 1',
          items: [
            { component: this.demoComponent },
            { component: this.demoComponent },
            { component: this.demoComponent },
          ],
        },
      ],
    },
    [LayoutType.Tablet]: {
      cardMargin: '1rem',
      lists: [
        {
          width: '1fr',
          containerName: 'List 1',
          items: [
            { component: this.demoComponent },
            { component: this.demoComponent },
            { component: this.demoComponent },
          ],
        },
      ],
    },
  };

  editPressed() {
    this.editing.update((prev) => !prev);
  }

  resetPressed() {
    this.layoutConfig = {
      version: 1,
      name: 'Demo Layout',
      [LayoutType.Mobile]: {
        cardMargin: '0.5rem',
        lists: [
          {
            width: '1fr',
            containerName: 'List 1',
            items: [
              { component: this.demoComponent },
              { component: this.demoComponent },
              { component: this.demoComponent },
            ],
          },
        ],
      },
      [LayoutType.Tablet]: {
        cardMargin: '1rem',
        lists: [
          {
            width: '1fr',
            containerName: 'List 1',
            items: [
              { component: this.demoComponent },
              { component: this.demoComponent },
              { component: this.demoComponent },
            ],
          },
          {
            width: '2fr',
            containerName: 'List 2',
            items: [
              { component: this.demoComponent },
              { component: this.demoComponent },
              { component: this.demoComponent },
            ],
          },
        ],
      },
    };
  }

  layoutChanged(layoutConfig: CustomizableLayoutConfig) {
    this.layoutConfig = layoutConfig;
  }
}
