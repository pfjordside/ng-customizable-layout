import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomizableLayoutComponent } from './customizable-layout.component';
import { WINDOW_REF } from './model/window-ref.token';

@NgModule({
  declarations: [CustomizableLayoutComponent],
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
  exports: [CustomizableLayoutComponent],
})
export class CustomizableLayoutModule {}
