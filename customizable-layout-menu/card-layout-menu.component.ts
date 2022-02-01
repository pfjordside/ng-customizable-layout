import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-layout-menu',
  templateUrl: './card-layout-menu.component.html',
  styleUrls: ['./card-layout-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardLayoutMenuComponent {
  @Output() removeColRightPressed = new EventEmitter<void>();
  @Output() removeColLeftPressed = new EventEmitter<void>();
  @Output() addColRightPressed = new EventEmitter<void>();
  @Output() addColLeftPressed = new EventEmitter<void>();
  @Output() resizePressed = new EventEmitter<void>();
  @Output() resetPressed = new EventEmitter<void>();
  @Output() editPressed = new EventEmitter<void>();
  @Input() removeDisabled: boolean;
  @Input() resizingLayout: boolean;
  @Input() editingLayout: boolean;
}
