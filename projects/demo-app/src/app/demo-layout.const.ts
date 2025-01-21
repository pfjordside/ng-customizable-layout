import { CustomizableLayoutConfig, LayoutType } from 'ng-customizable-layout';

export const demoLayoutConfig: CustomizableLayoutConfig = {
  version: 1,
  name: 'Demo Layout',
  [LayoutType.Mobile]: {
    cardMargin: '0.5rem',
    lists: [
      {
        width: '1fr',
        containerName: 'List 1',
        items: [
          { componentName: 'DemoComponent' },
          { componentName: 'DemoComponent' },
          { componentName: 'DemoComponent' },
        ],
      },
    ],
  },
  [LayoutType.Tablet]: {
    cardMargin: '1rem',
    lists: [
      {
        width: '1fr',
        containerName: 'List 1',
        items: [
          { componentName: 'DemoComponent' },
          { componentName: 'DemoComponent' },
          { componentName: 'DemoComponent' },
        ],
      },
    ],
  },
};
