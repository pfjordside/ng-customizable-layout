import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomizableLayoutComponent } from './customizable-layout.component';
import { WINDOW_REF } from './model/window-ref.token';
import { WithoutHiddenPipe } from './without-hidden-pipe/without-hidden.pipe';

@NgModule({
  declarations: [CustomizableLayoutComponent, WithoutHiddenPipe],
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
