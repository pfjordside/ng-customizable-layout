import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { StateItem } from 'src/app/libraries/lf-web-utils/state-item/state-item.class';
import { CardElement } from 'src/app/shared/components/card-layout/model/card-element.interface';
import { createGuid } from '../../functions/create-guid.fn';
import { DeviceType } from '../../model/device-type.enum';
import { WindowService } from '../../services/window/window.service';
import { CardLayoutConfig } from './customizable-layout/model/card-layout-config.interface';
import { CardLayout } from './customizable-layout/model/card-layout.interface';
import { CardList } from './customizable-layout/model/card-list.interface';
import { ResizeDialogComponent } from './customizable-layout-menu/resize-dialog/resize-dialog.component';

@Component({
  selector: 'app-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizableLayoutComponent implements OnInit {
  @Output() editingChanged = new EventEmitter<boolean>();
  @Input() componentMap: { [key: string]: Type<any> };
  @Input() defaultLayout: CardLayoutConfig;
  @Input() componentInjector: Injector;
  @Input() showEdit: boolean = true;
  @Input() editing: boolean;

  private _currentLayout: StateItem<CardLayoutConfig>;
  layoutUpdated = new BehaviorSubject<void>(null);
  layout$: Observable<CardLayout>;
  templateColumns$: Observable<string>;

  constructor(private windowService: WindowService, private matDialog: MatDialog) {
    this.layout$ = combineLatest([windowService.deviceType.value$, this.layoutUpdated]).pipe(
      map(() => {
        return this.getConnectedLists(this.currentLayout);
      })
    );
    this.templateColumns$ = combineLatest([windowService.deviceType.value$, this.layoutUpdated]).pipe(
      map(() => {
        return this.currentColumns;
      })
    );
  }

  ngOnInit(): void {
    this.initializeState();
  }

  initializeState() {
    this._currentLayout = new StateItem<CardLayoutConfig>(
      this.defaultLayout,
      this.defaultLayout.name,
      this.defaultLayout.persist ? localStorage : null
    );
  }

  drop(event: CdkDragDrop<CardElement[]>) {
    let layout = this.currentLayout;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const index = layout.lists.map(l => l.containerName).indexOf(event.container.id);
      layout.lists[index].cards = event.container.data;
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const prevListIndex = layout.lists.map(l => l.containerName).indexOf(event.previousContainer.id);
      const currListIndex = layout.lists.map(l => l.containerName).indexOf(event.container.id);
      layout.lists[prevListIndex].cards = event.previousContainer.data;
      layout.lists[currListIndex].cards = event.container.data;
    }
    this.currentLayout = { ...layout };
  }

  toggleEditing() {
    this.editing = !this.editing;
    this.editingChanged.emit(this.editing);
  }

  resizePressed() {
    this.matDialog
      .open(ResizeDialogComponent, { data: { fractions: this.currentColumns.split(' ') } })
      .afterClosed()
      .pipe(first())
      .subscribe((fractions: string[] | null) => {
        if (fractions !== null) {
          this.updateColumnFractions(fractions);
          this.layoutUpdated.next();
        }
      });
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
    let spillOver = this.currentLayout.lists[0].cards;
    let lists = this.currentLayout.lists.slice(1);
    lists[0].cards.push(...spillOver);
    this.currentLayout = {
      ...this.currentLayout,
      lists,
    };
    this.updateLayout();
  }

  removeColumnRightPressed() {
    let lists = this.currentLayout.lists;
    let spillOver = lists[lists.length - 1].cards;
    const removedList = lists.pop();
    lists[lists.length - 1].cards.push(...spillOver);
    this.currentLayout = {
      ...this.currentLayout,
      lists,
    };
    this.updateLayout();
  }

  resetPressed() {
    switch (this.windowService.deviceType.value) {
      case DeviceType.Tablet: {
        this.currentLayout = cloneDeep(this.getConnectedLists(this.defaultLayout.tablet));
        break;
      }
      default: {
        this.currentLayout = cloneDeep(this.getConnectedLists(this.defaultLayout.mobile));
      }
    }
    this.layoutUpdated.next();
  }

  cardTrackBy(index: number, name: CardElement): string {
    return name.componentName;
  }

  listTrackBy(index: number, list: CardList): string {
    return list.containerName;
  }

  private updateLayout() {
    this.currentLayout = this.getConnectedLists(this.currentLayout);
    this.layoutUpdated.next();
  }

  private getEmptyList(): CardList {
    return {
      cards: [],
      width: '1fr',
      connectedTo: [],
      containerName: createGuid(),
    };
  }

  private getConnectedLists(layout: CardLayout): CardLayout {
    return {
      ...layout,
      lists: layout.lists.map(l => ({
        ...l,
        connectedTo: this.getConnectedToString(l.containerName),
      })),
    };
  }

  private getConnectedToString(self: string): string[] {
    return this.currentLayout.lists.map(l => l.containerName).filter(cn => cn !== self);
  }

  private updateColumnFractions(fractions: string[]) {
    const updated = {
      ...this.currentLayout,
      lists: this.currentLayout.lists.map((l, i) => ({
        ...l,
        width: fractions[i] ?? 'auto',
      })),
    };
    this.currentLayout = updated;
  }

  private get currentColumns(): string {
    return this.currentLayout.lists.map(l => l.width).reduce((cur, prev) => cur + ' ' + prev, '');
  }

  private get currentLayout(): CardLayout {
    switch (this.windowService.deviceType.value) {
      case DeviceType.Tablet: {
        return this._currentLayout.value.tablet;
      }
      default: {
        return this._currentLayout.value.mobile;
      }
    }
  }

  private set currentLayout(newVal: CardLayout) {
    switch (this.windowService.deviceType.value) {
      case DeviceType.Tablet: {
        this._currentLayout.value = {
          ...this._currentLayout.value,
          tablet: newVal,
        };
        break;
      }
      default: {
        this._currentLayout.value = {
          ...this._currentLayout.value,
          mobile: newVal,
        };
      }
    }
  }
}
