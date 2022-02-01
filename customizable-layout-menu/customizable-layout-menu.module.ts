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
import { CardLayoutMenuComponent } from './customizable-layout-menu/card-layout-menu.component';
import { CardLayoutComponent } from './card-layout.component';
import { ResizeDialogComponent } from './customizable-layout-menu/resize-dialog/resize-dialog.component';

@NgModule({
  declarations: [CardLayoutMenuComponent, ResizeDialogComponent],
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
  exports: [CardLayoutComponent],
})
export class CustomizableLayoutMenuModule {}
