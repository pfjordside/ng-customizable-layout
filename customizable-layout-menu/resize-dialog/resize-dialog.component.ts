import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEmpty } from 'lodash-es';
import { ResizeDialogData } from './resize-dialog-data.interface';

@Component({
  selector: 'app-resize-dialog',
  templateUrl: './resize-dialog.component.html',
  styleUrls: ['./resize-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeDialogComponent {
  fractions: string[];
  numericFractions: number[];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: ResizeDialogData,
    private matDialogRef: MatDialogRef<ResizeDialogComponent>
  ) {
    this.fractions = data.fractions.filter(s => !isEmpty(s));
    this.numericFractions = this.fractions.map(f => +f.replace('fr', ''));
  }

  updateFraction(change: number, index: number) {
    this.numericFractions[index] = change;
    this.fractions[index] = change + 'fr';
  }

  apply() {
    this.matDialogRef.close(this.fractions);
  }

  cancel() {
    this.matDialogRef.close(null);
  }

  formatLabel(value: number): string {
    return value + 'fr';
  }

  get fractionsString() {
    return this.fractions.reduce((cur, prev) => cur + ' ' + prev, '');
  }

  trackByIndex(index: number, value: number): string {
    return String(index);
  }
}
