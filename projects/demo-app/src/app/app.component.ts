import { Component, signal } from '@angular/core';
import {
  ComponentMap,
  CustomizableLayoutComponent,
  CustomizableLayoutConfig,
  CustomizableLayoutMenuComponent,
} from 'ng-customizable-layout';
import { demoLayoutConfig } from './demo-layout.const';
import { DemoComponent } from './demo/demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomizableLayoutComponent, CustomizableLayoutMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  editing = signal(false);
  componentMap: ComponentMap = {
    ['DemoComponent']: { component: DemoComponent, hidden: false },
  };
  layoutConfig: CustomizableLayoutConfig = demoLayoutConfig;

  editPressed() {
    this.editing.update((prev) => !prev);
  }

  resetPressed() {
    this.layoutConfig = demoLayoutConfig;
  }

  layoutChanged(layoutConfig: CustomizableLayoutConfig) {
    this.layoutConfig = layoutConfig;
  }
}
