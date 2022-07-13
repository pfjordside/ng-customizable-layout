import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Injector, Input, OnDestroy, OnInit, Output, Type } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, combineLatest, fromEvent, Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { StateItem } from 'src/app/libraries/lf-web-utils/state-item/state-item.class';
import { createGuid } from 'src/app/shared/functions/create-guid.fn';
import { CustomizableLayoutConfig } from './model/customizable-layout-config.interface';
import { CustomizableLayout } from './model/customizable-layout.interface';
import { LayoutElement } from './model/layout-element.interface';
import { LayoutList } from './model/layout-list.interface';
import { LayoutType } from './model/layout-type.enum';
import { WINDOW_REF } from './model/window-ref.token';

@Component({
  selector: 'ng-customizable-layout',
  templateUrl: './customizable-layout.component.html',
  styleUrls: ['./customizable-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizableLayoutComponent implements OnInit, OnDestroy {
  @Output() layoutChanged = new EventEmitter<CustomizableLayout>();
  @Input() defaultLayout: CustomizableLayoutConfig;
  @Input() componentMap: { [key: string]: Type<any> };
  @Input() componentInjector: Injector;
  @Input() desktopBreakpoint: number = 1024;
  @Input() tabletBreakpoint = 990;
  @Input() mobileBreakpoint = 420;
  @Input() editing: boolean;
  
  private subs = new Subscription();
  private _layoutState: StateItem<CustomizableLayoutConfig>;
  private _layoutType: LayoutType = LayoutType.Mobile; // Mobile first <3
  layoutUpdated = new BehaviorSubject<void>(null);
  layout$: Observable<CustomizableLayout>;
  templateColumns$: Observable<string>;

  constructor(@Inject(WINDOW_REF) private windowRef: Window) {}

  ngOnInit(): void {
    this.subs.add(this.layoutType$.subscribe((type) => {
      this._layoutType = type;
    }));
    this.layout$ = combineLatest([this.layoutType$, this.layoutUpdated]).pipe(
      filter(u => u !== null && u !== undefined),
      map(() => {
        const layout = this.getConnectedLists(this.currentLayout);
        this.layoutChanged.next(layout);
        return layout;
      })
    );
    this.templateColumns$ = combineLatest([this.layoutType$, this.layoutUpdated]).pipe(
      map(() => {
        return this.currentColumns;
      })
    );
    this.initializeState();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initializeState() {
    this._layoutState = new StateItem<CustomizableLayoutConfig>(
      this.defaultLayout,
      this.defaultLayout.name,
      this.defaultLayout.persist ? this.windowRef.localStorage : null
    );
  }

  drop(event: CdkDragDrop<LayoutElement[]>) {
    let layout = this.currentLayout;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const index = layout.lists.map(l => l.containerName).indexOf(event.container.id);
      layout.lists[index].items = event.container.data;
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const prevListIndex = layout.lists.map(l => l.containerName).indexOf(event.previousContainer.id);
      const currListIndex = layout.lists.map(l => l.containerName).indexOf(event.container.id);
      layout.lists[prevListIndex].items = event.previousContainer.data;
      layout.lists[currListIndex].items = event.container.data;
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
    this.currentLayout = cloneDeep(this.getConnectedLists(this.defaultLayout[this._layoutType]));
    this.layoutUpdated.next();
  }

  cardTrackBy(index: number, name: LayoutElement): string {
    return name.componentName;
  }

  listTrackBy(index: number, list: LayoutList): string {
    return list.containerName;
  }

  private updateLayout() {
    this.currentLayout = this.getConnectedLists(this.currentLayout);
    this.layoutUpdated.next();
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
    return this._layoutState.value[this._layoutType];
  }

  private set currentLayout(newVal: CustomizableLayout) {
    this._layoutState.value = {
      ...this._layoutState.value,
      [this._layoutType]: newVal
    };
  }

  private get layoutType$(): Observable<LayoutType> {
    return fromEvent(this.windowRef, 'resize')
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
        }),
      )
  }
}
