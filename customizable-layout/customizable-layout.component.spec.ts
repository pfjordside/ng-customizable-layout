import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponents } from 'ng-mocks';
import { CustomizableLayoutComponent } from './customizable-layout.component';
import { LayoutType } from './model/layout-type.enum';
import { WINDOW_REF } from './model/window-ref.token';

describe('CustomizableLayoutComponent', () => {
  let spectator: Spectator<CustomizableLayoutComponent>;
  const createComponent = createComponentFactory({
    providers: [
      {
        provide: WINDOW_REF,
        useValue: window
      }
    ],
    component: CustomizableLayoutComponent,
    declarations: [MockComponents(CustomizableLayoutComponent)],
  });

  it('should create', () => {
    spectator = createComponent({
      props: {
        defaultLayout: {
          name: 'mobile',
          persist: false,
          [LayoutType.Mobile]: {
            cardMargin: '1rem',
            lists: [],
          },
        },
      },
    });

    expect(spectator.component).toBeTruthy();
  });
});
