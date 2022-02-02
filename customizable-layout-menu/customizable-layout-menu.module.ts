import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';
import { LFButtonModule } from 'src/app/libraries/lf-buttons/lf-button.module';
import { CustomizableLayoutMenuComponent } from './customizable-layout-menu.component';
import { ResizeDialogComponent } from './resize-dialog/resize-dialog.component';

@NgModule({
  declarations: [CustomizableLayoutMenuComponent, ResizeDialogComponent],
  entryComponents: [ResizeDialogComponent],
  imports: [
    MatSliderModule,
    MatDialogModule,
    TranslateModule,
    MatInputModule,
    LFButtonModule,
    DragDropModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  exports: [CustomizableLayoutMenuComponent],
})
export class CustomizableLayoutMenuModule {}
