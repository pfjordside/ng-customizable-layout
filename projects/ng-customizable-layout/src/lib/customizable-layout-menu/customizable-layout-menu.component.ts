import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'ng-customizable-layout-menu',
  templateUrl: './customizable-layout-menu.component.html',
  styleUrls: ['./customizable-layout-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, DragDropModule, MatMenu, MatMenuItem, MatMenuTrigger, MatIcon, FormsModule, MatIconButton],
})
export class CustomizableLayoutMenuComponent {
  @Output() removeColRightPressed = new EventEmitter<void>();
  @Output() removeColLeftPressed = new EventEmitter<void>();
  @Output() addColRightPressed = new EventEmitter<void>();
  @Output() addColLeftPressed = new EventEmitter<void>();
  @Output() resizePressed = new EventEmitter<void>();
  @Output() resetPressed = new EventEmitter<void>();
  @Output() editPressed = new EventEmitter<void>();
  @Input() removeDisabled!: boolean;
  @Input() resizingLayout!: boolean;
  @Input() editingLayout!: boolean;

  constructor() {}
}
