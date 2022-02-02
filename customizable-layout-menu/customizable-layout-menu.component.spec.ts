import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponents } from 'ng-mocks';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { CustomizableLayoutMenuComponent } from './customizable-layout-menu.component';

describe('CustomizableLayoutMenuComponent', () => {
  let spectator: Spectator<CustomizableLayoutMenuComponent>;
  const createComponent = createComponentFactory({
    component: CustomizableLayoutMenuComponent,
    declarations: [MockComponents(IconComponent)],
    imports: [MatSlideToggleModule, MatMenuModule, MatIconModule],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
