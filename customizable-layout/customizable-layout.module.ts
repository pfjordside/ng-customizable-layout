import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomizableLayoutComponent } from './customizable-layout.component';
import { FilterPipe } from './filter-pipe/filter.pipe';
import { WINDOW_REF } from './model/window-ref.token';

@NgModule({
  declarations: [CustomizableLayoutComponent, FilterPipe],
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
