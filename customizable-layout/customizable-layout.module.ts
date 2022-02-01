import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomizableLayoutComponent } from './customizable-layout.component';

@NgModule({
  declarations: [CustomizableLayoutComponent],
  imports: [
    DragDropModule,
    CommonModule,
  ],
  exports: [CustomizableLayoutComponent],
})
export class CustomizableLayoutModule {}
