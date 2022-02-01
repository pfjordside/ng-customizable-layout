import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponents } from 'ng-mocks';
import { CardLayoutMenuComponent } from './card-layout-menu/card-layout-menu.component';
import { CardLayoutComponent } from './card-layout.component';
import { CustomizableLayoutComponent } from './customizable-layout.component';

describe('CustomizableLayoutComponent', () => {
  let spectator: Spectator<CustomizableLayoutComponent>;
  const createComponent = createComponentFactory({
    component: CardLayoutComponent,
    declarations: [MockComponents(CardLayoutMenuComponent)],
  });

  it('should create', () => {
    spectator = createComponent({
      props: {
        defaultLayout: {
          name: 'mobile',
          persist: false,
          mobile: {
            cardMargin: '1rem',
            lists: [],
          },
        },
      },
    });

    expect(spectator.component).toBeTruthy();
  });
});
