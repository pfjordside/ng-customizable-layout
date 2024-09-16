import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { ComponentMap } from './model/component-map.interface';
import { CustomizableLayoutConfig, isCustomizableLayoutConfig } from './model/customizable-layout-config.interface';
import { CustomizableLayout } from './model/customizable-layout.interface';
import { LayoutElement } from './model/layout-element.interface';
import { LayoutList } from './model/layout-list.interface';
import { LayoutType } from './model/layout-type.enum';
import { WINDOW_REF } from './model/window-ref.token';
import { CommonModule } from '@angular/common';
import { createGuid } from '../utils/create-guid.fn';

@Component({
  standalone: true,
  selector: 'ng-customizable-layout',
  templateUrl: './customizable-layout.component.html',
  styleUrls: ['./customizable-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    CommonModule,
  ],
  providers: [
    {
      provide: WINDOW_REF,
      useValue: window
    }
  ],
})
export class CustomizableLayoutComponent implements OnInit, OnDestroy {
  @Output() layoutChanged = new EventEmitter<CustomizableLayout>();
  @Input() defaultLayout!: CustomizableLayoutConfig;
  @Input() componentInjector!: Injector;
  @Input() componentMap!: ComponentMap;
  @Input() editing!: boolean = false;

  @Input() desktopBreakpoint = 1024;
  @Input() tabletBreakpoint = 990;
  @Input() mobileBreakpoint = 420;
  
  private _layoutState = new BehaviorSubject<CustomizableLayoutConfig | null>(null);
  private _layoutType: LayoutType = LayoutType.Mobile; // Mobile first <3
  private subs = new Subscription();
  
  dragDelay$!: Observable<number>;
  layoutType$!: Observable<LayoutType>;
  layout$!: Observable<CustomizableLayout>;
  templateColumns$!: Observable<string>;

  constructor(@Inject(WINDOW_REF) private windowRef: Window) {}

  ngOnInit(): void {
    this.initializeState();
    this.layoutType$ = fromEvent(this.windowRef, 'resize')
    .pipe(
      map((e: any) => e.target?.innerWidth),
      startWith(this.windowRef.innerWidth),
      map(width => {
        if (width <= this.tabletBreakpoint) {
          return LayoutType.Mobile;
        } else {
          return LayoutType.Tablet;
        }
        // TODO: Support desktop layout, fallback to tablet, then mobile
      }));
      this.dragDelay$ = this.layoutType$.pipe(map(layout => {
        switch (layout) {
          case LayoutType.Mobile : {
            return 150;
          } default : {
            return 0;
          }
        }
      }));
    this.subs.add(this.layoutType$.subscribe((type) => {
      this._layoutType = type;
    }));
    this.layout$ = combineLatest([this.layoutType$, this._layoutState]).pipe(
      filter(u => u !== null && u !== undefined),
      map(() => {
        const layout = this.getConnectedLists(this.currentLayout);
        this.layoutChanged.next(layout);
        return layout;
      })
    );
    this.templateColumns$ = combineLatest([this.layoutType$, this._layoutState]).pipe(
      map(() => {
        return this.currentColumns;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initializeState() {
    let storedLayout = this.windowRef.localStorage.getItem(this.defaultLayout.name);
    if (storedLayout && isCustomizableLayoutConfig(storedLayout) && this.defaultLayout.version <= storedLayout.version) {
        this._layoutState.next(storedLayout);
    } else {
      this._layoutState.next(this.createCopy(this.defaultLayout));
    }
  }

  drop(event: CdkDragDrop<LayoutElement[]>) {
    let layout = this.currentLayout;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const index = layout.lists.map(l => l.containerName).indexOf(event.container.id);
      layout.lists[index].items = [...event.container.data];
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const prevListIndex = layout.lists.map(l => l.containerName).indexOf(event.previousContainer.id);
      const currListIndex = layout.lists.map(l => l.containerName).indexOf(event.container.id);
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
    const defaultLayout =  this.defaultLayout[this._layoutType];
    if (defaultLayout) {
      this.currentLayout = this.createCopy(this.getConnectedLists(defaultLayout));
    }
  }

  cardTrackBy(index: number, name: LayoutElement): string {
    return name.componentName;
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
      lists: layout?.lists.map(l => ({
        ...l,
        connectedTo: this.getConnectedToString(l.containerName),
      })),
    };
  }

  private getConnectedToString(self: string): string[] {
    return this.currentLayout.lists.map(l => l.containerName).filter(cn => cn !== self);
  }

  private getEmptyList(): LayoutList {
    return {
      items: [],
      width: '1fr',
      connectedTo: [],
      containerName: createGuid(),
    };
  }

  private get currentColumns(): string {
    return this.currentLayout.lists.map(l => l.width).reduce((cur, prev) => cur + ' ' + prev, '');
  }

  private get currentLayout(): CustomizableLayout {
    return this._layoutState.getValue()[this._layoutType];
  }

  private set currentLayout(newVal: CustomizableLayout) {
    const updatedLayout = {
      ...this._layoutState.getValue(),
      [this._layoutType]: newVal
    }
    this._layoutState.next(updatedLayout);
    this.windowRef.localStorage.setItem(updatedLayout.name, JSON.stringify(updatedLayout));
  }

  private createCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
