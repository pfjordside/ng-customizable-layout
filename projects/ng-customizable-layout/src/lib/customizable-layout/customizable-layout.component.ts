import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, Inject, input, output, signal } from '@angular/core';
import { createGuid } from '../utils/create-guid.fn';
import { LayoutElement } from './model';
import { CustomizableLayoutConfig, isCustomizableLayoutConfig } from './model/customizable-layout-config.interface';
import { CustomizableLayout } from './model/customizable-layout.interface';
import { LayoutList } from './model/layout-list.interface';
import { LayoutType } from './model/layout-type.enum';
import { TemplateMap } from './model/template-map.interface';
import { WINDOW_REF } from './model/window-ref.token';
import { GetTemplateRefPipe, WithoutHiddenPipe } from './pipes';

@Component({
  selector: 'ng-customizable-layout',
  templateUrl: './customizable-layout.component.html',
  styleUrls: ['./customizable-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, NgClass, NgStyle, NgTemplateOutlet, WithoutHiddenPipe, GetTemplateRefPipe],
  providers: [
    {
      provide: WINDOW_REF,
      useValue: window,
    },
  ],
})
export class CustomizableLayoutComponent {
  layoutChanged = output<CustomizableLayout>();
  layoutConfig = input<CustomizableLayoutConfig>();
  templateMap = input<TemplateMap>();
  editing = input(false);

  desktopBreakpoint = input(1024);
  tabletBreakpoint = input(990);
  mobileBreakpoint = input(420);

  templateColumns = computed(() => this.currentColumns);
  dragDelay = computed(() => {
    switch (this._layoutType()) {
      case LayoutType.Mobile:
        return 150;
      default:
        return 0;
    }
  });
  currentLayout = computed(() => {
    return this._layoutState()?.[this._layoutType()] as CustomizableLayout;
  });

  private _innerWidth = signal(window.innerWidth);
  private _layoutState = signal<CustomizableLayoutConfig | null>(null);
  private _layoutType = signal<LayoutType>(LayoutType.Mobile); // Mobile first <3

  constructor(@Inject(WINDOW_REF) private windowRef: Window) {
    effect(() => {
      const layoutConfig = this.layoutConfig();
      if (layoutConfig) {
        this.initializeState(layoutConfig);
      }
    });
    effect(() => {
      const width = this._innerWidth();
      if (width > this.desktopBreakpoint() && !!this.layoutConfig()?.[LayoutType.Desktop]) {
        this._layoutType.set(LayoutType.Desktop);
      } else if (width > this.tabletBreakpoint() && !!this.layoutConfig()?.[LayoutType.Tablet]) {
        this._layoutType.set(LayoutType.Tablet);
      } else {
        this._layoutType.set(LayoutType.Mobile);
      }
    });
    // Update the innerWidth signal when the window is resized
    this.windowRef.addEventListener('resize', () => {
      this._innerWidth.set(this.windowRef.innerWidth);
    });
  }

  initializeState(layoutConfig: CustomizableLayoutConfig) {
    let storedLayout = this.windowRef.localStorage.getItem(layoutConfig.name);
    if (!storedLayout) {
      this._layoutState.set(layoutConfig);
      return;
    }
    storedLayout = JSON.parse(storedLayout);
    if (storedLayout && isCustomizableLayoutConfig(storedLayout) && layoutConfig.version <= storedLayout.version) {
      this._layoutState.set(storedLayout);
    }
  }

  drop(event: CdkDragDrop<LayoutElement[]>) {
    let layout = this.currentLayout();
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const index = layout.lists.map((l) => l.containerName).indexOf(event.container.id);
      layout.lists[index].items = [...event.container.data];
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const prevListIndex = layout.lists.map((l) => l.containerName).indexOf(event.previousContainer.id);
      const currListIndex = layout.lists.map((l) => l.containerName).indexOf(event.container.id);
      layout.lists[prevListIndex].items = [...event.previousContainer.data];
      layout.lists[currListIndex].items = [...event.container.data];
    }
    this.updateCurrentLayout({ ...layout });
  }

  addColumnRightPressed() {
    this.updateCurrentLayout({
      ...this.currentLayout(),
      lists: [...this.currentLayout().lists, this.getEmptyList()],
    });
  }

  addColumnLeftPressed() {
    this.updateCurrentLayout({
      ...this.currentLayout(),
      lists: [this.getEmptyList(), ...this.currentLayout().lists],
    });
  }

  removeColumnLeftPressed() {
    let spillOver = this.currentLayout().lists[0].items;
    let lists = this.currentLayout().lists.slice(1);
    lists[0].items.push(...spillOver);
    this.updateCurrentLayout({
      ...this.currentLayout(),
      lists,
    });
  }

  removeColumnRightPressed() {
    let lists = this.currentLayout().lists;
    let spillOver = lists[lists.length - 1].items;
    const removedList = lists.pop();
    lists[lists.length - 1].items.push(...spillOver);
    this.updateCurrentLayout({
      ...this.currentLayout(),
      lists,
    });
  }

  resetPressed() {
    const defaultLayout = this.layoutConfig()?.[this._layoutType()];
    if (defaultLayout) {
      this.updateCurrentLayout(defaultLayout);
    }
  }

  private getEmptyList(): LayoutList {
    return {
      items: [],
      width: '1fr',
      connectedTo: [],
      containerName: createGuid(),
    };
  }

  private get currentColumns() {
    return this.currentLayout()
      ?.lists?.map((l) => l.width)
      .reduce((cur, prev) => cur + ' ' + prev, '');
  }

  private updateCurrentLayout(newVal: CustomizableLayout) {
    const updatedLayout = {
      ...this._layoutState(),
      [this._layoutType()]: newVal,
    } as CustomizableLayoutConfig;
    this._layoutState.set(updatedLayout);
    this.windowRef.localStorage.setItem(updatedLayout.name, JSON.stringify(updatedLayout));
  }

  cardTrackBy(index: number, item: LayoutElement): string {
    // Use a combination of templateName and index for uniqueness
    return `${item.templateName}-${index}`;
  }
}
