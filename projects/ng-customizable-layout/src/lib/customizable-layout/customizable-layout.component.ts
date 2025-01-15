import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, EventEmitter, Inject, Input, OnInit, Output, signal } from '@angular/core';
import { createGuid } from '../utils/create-guid.fn';
import { CustomizableLayoutConfig, isCustomizableLayoutConfig } from './model/customizable-layout-config.interface';
import { CustomizableLayout } from './model/customizable-layout.interface';
import { LayoutElement } from './model/layout-element.interface';
import { LayoutList } from './model/layout-list.interface';
import { LayoutType } from './model/layout-type.enum';
import { WINDOW_REF } from './model/window-ref.token';
import { WithoutHiddenPipe } from './without-hidden-pipe/without-hidden.pipe';

@Component({
  standalone: true,
  selector: 'ng-customizable-layout',
  templateUrl: './customizable-layout.component.html',
  styleUrls: ['./customizable-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, CommonModule, WithoutHiddenPipe],
  providers: [
    {
      provide: WINDOW_REF,
      useValue: window,
    },
  ],
})
export class CustomizableLayoutComponent implements OnInit {
  @Output() layoutChanged = new EventEmitter<CustomizableLayout>();
  @Input() defaultLayout!: CustomizableLayoutConfig;
  // @Input() componentInjector!: Injector;
  // @Input() componentMap!: ComponentMap;
  @Input() editing: boolean = false;

  @Input() desktopBreakpoint = 1024;
  @Input() tabletBreakpoint = 990;
  @Input() mobileBreakpoint = 420;

  private _layoutState = signal<CustomizableLayoutConfig | null>(null);
  private _layoutType = signal<LayoutType>(LayoutType.Mobile); // Mobile first <3

  dragDelay = computed(() => {
    switch (this._layoutType()) {
      case LayoutType.Mobile:
        return 150;
      default:
        return 0;
    }
  });
  layout = computed(() => {
    const layout = this.getConnectedLists(this.currentLayout);
    this.layoutChanged.next(layout);
    return layout;
  });
  templateColumns = computed(() => this.currentColumns);

  constructor(@Inject(WINDOW_REF) private windowRef: Window) {}

  ngOnInit(): void {
    this.initializeState();
    effect(() => {
      const width = this.windowRef.innerWidth;
      if (width > this.desktopBreakpoint) {
        this._layoutType.set(LayoutType.Desktop);
      } else if (width > this.tabletBreakpoint) {
        this._layoutType.set(LayoutType.Tablet);
      } else {
        this._layoutType.set(LayoutType.Mobile);
      }
    });
  }

  initializeState() {
    let storedLayout = this.windowRef.localStorage.getItem(this.defaultLayout.name);
    if (storedLayout && isCustomizableLayoutConfig(storedLayout) && this.defaultLayout.version <= storedLayout.version) {
      this._layoutState.set(storedLayout);
    } else {
      this._layoutState.set(this.createCopy(this.defaultLayout));
    }
  }

  drop(event: CdkDragDrop<LayoutElement[]>) {
    let layout = this.currentLayout;
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
    this.currentLayout = { ...layout };
  }

  addColumnRightPressed() {
    this.currentLayout = {
      ...this.currentLayout,
      lists: [...this.currentLayout.lists, this.getEmptyList()],
    };
    this.updateLayout();
  }

  addColumnLeftPressed() {
    this.currentLayout = {
      ...this.currentLayout,
      lists: [this.getEmptyList(), ...this.currentLayout.lists],
    };
    this.updateLayout();
  }

  removeColumnLeftPressed() {
    let spillOver = this.currentLayout.lists[0].items;
    let lists = this.currentLayout.lists.slice(1);
    lists[0].items.push(...spillOver);
    this.currentLayout = {
      ...this.currentLayout,
      lists,
    };
    this.updateLayout();
  }

  removeColumnRightPressed() {
    let lists = this.currentLayout.lists;
    let spillOver = lists[lists.length - 1].items;
    const removedList = lists.pop();
    lists[lists.length - 1].items.push(...spillOver);
    this.currentLayout = {
      ...this.currentLayout,
      lists,
    };
    this.updateLayout();
  }

  resetPressed() {
    const defaultLayout = this.defaultLayout[this._layoutType()];
    if (defaultLayout) {
      this.currentLayout = this.createCopy(this.getConnectedLists(defaultLayout));
    }
  }

  cardTrackBy(index: number, name: LayoutElement): string {
    return name.component.name;
  }

  listTrackBy(index: number, list: LayoutList): string {
    return list.containerName;
  }

  private updateLayout() {
    this.currentLayout = this.getConnectedLists(this.currentLayout);
  }

  private getConnectedLists(layout: CustomizableLayout): CustomizableLayout {
    return {
      ...layout,
      lists: layout?.lists.map((l) => ({
        ...l,
        connectedTo: this.getConnectedToString(l.containerName),
      })),
    };
  }

  private getConnectedToString(self: string): string[] {
    return this.currentLayout.lists.map((l) => l.containerName).filter((cn) => cn !== self);
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
    return this.currentLayout?.lists.map((l) => l.width).reduce((cur, prev) => cur + ' ' + prev, '');
  }

  private get currentLayout() {
    return this._layoutState()?.[this._layoutType()] as CustomizableLayout;
  }

  private set currentLayout(newVal: CustomizableLayout) {
    const updatedLayout = {
      ...this._layoutState(),
      [this._layoutType()]: newVal,
    } as CustomizableLayoutConfig;
    this._layoutState.set(updatedLayout);
    this.windowRef.localStorage.setItem(updatedLayout.name, JSON.stringify(updatedLayout));
  }

  private createCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
