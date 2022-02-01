import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { ResizeDialogComponent } from './resize-dialog.component';

describe('ResizeDialogComponent', () => {
  let spectator: Spectator<ResizeDialogComponent>;
  const createComponent = createComponentFactory({
    component: ResizeDialogComponent,
    imports: [MatButtonModule, MatDialogModule],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          fractions: [],
        },
      },
      mockProvider(MatDialogRef),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
