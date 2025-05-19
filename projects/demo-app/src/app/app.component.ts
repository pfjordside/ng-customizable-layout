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
          items: [
            { templateName: 'cardTemplate', id: '1' },
            { templateName: 'otherCardTemplate', id: '2' },
            { templateName: 'cardTemplate', id: '3' },
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
            { templateName: 'cardTemplate', id: '1' },
            { templateName: 'otherCardTemplate', id: '2' },
            { templateName: 'cardTemplate', id: '3' },
          ],
        },
        {
          width: '2fr',
          containerName: 'List 2',
          items: [
            { templateName: 'cardTemplate', id: '4' },
            { templateName: 'otherCardTemplate', id: '5' },
            { templateName: 'cardTemplate', id: '6' },
          ],
        },
      ],
    },
    [LayoutType.Desktop]: {
      cardMargin: '1rem',
      lists: [
        {
          width: '1fr',
          containerName: 'List 1',
          items: [
            { templateName: 'cardTemplate', id: '1' },
            { templateName: 'cardTemplate', id: '3' },
          ],
        },
        {
          width: '2fr',
          containerName: 'List 2',
          items: [
            { templateName: 'otherCardTemplate', id: '5' },
            { templateName: 'otherCardTemplate', id: '7' },
          ],
        },
        {
          width: '1fr',
          containerName: 'List 3',
          items: [
            { templateName: 'cardTemplate', id: '8' },
            { templateName: 'cardTemplate', id: '9' },
          ],
        },
      ],
    },
  };

  editPressed() {
    this.editing.update((prev) => !prev);
  }

  resetPressed() {}
}
