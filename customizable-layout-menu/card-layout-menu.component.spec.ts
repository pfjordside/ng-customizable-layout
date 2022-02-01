import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponents } from 'ng-mocks';
import { IconComponent } from '../../icon/icon.component';
import { CardLayoutMenuComponent } from './card-layout-menu.component';

describe('CardLayoutMenuComponent', () => {
  let spectator: Spectator<CardLayoutMenuComponent>;
  const createComponent = createComponentFactory({
    component: CardLayoutMenuComponent,
    declarations: [MockComponents(IconComponent)],
    imports: [MatSlideToggleModule, MatMenuModule, MatIconModule],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
