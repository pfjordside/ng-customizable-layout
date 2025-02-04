import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  CustomizableLayoutComponent,
  CustomizableLayoutConfig,
  CustomizableLayoutMenuComponent,
  LayoutType,
} from 'ng-customizable-layout';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomizableLayoutComponent, CustomizableLayoutMenuComponent, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  editing = signal(false);
  layoutConfig: CustomizableLayoutConfig = {
    version: 1,
    name: 'Demo Layout',
    [LayoutType.Mobile]: {
      cardMargin: '0.5rem',
      lists: [
        {
          width: '1fr',
          containerName: 'List 1',
          items: [{ templateName: 'cardTemplate' }, { templateName: 'cardTemplate' }, { templateName: 'cardTemplate' }],
        },
      ],
    },
    [LayoutType.Tablet]: {
      cardMargin: '1rem',
      lists: [
        {
          width: '1fr',
          containerName: 'List 1',
          items: [{ templateName: 'cardTemplate' }, { templateName: 'cardTemplate' }, { templateName: 'cardTemplate' }],
        },
        {
          width: '2fr',
          containerName: 'List 2',
          items: [{ templateName: 'cardTemplate' }, { templateName: 'cardTemplate' }, { templateName: 'cardTemplate' }],
        },
      ],
    },
  };

  editPressed() {
    this.editing.update((prev) => !prev);
  }

  resetPressed() {}
}
