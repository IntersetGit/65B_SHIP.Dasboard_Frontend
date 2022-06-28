import React from 'react';

const SettingUser = React.lazy(() => import('./settingUser'));
export const settingConfig = [
  {
    path: '/setting-page',
    element: <SettingUser />,
  },
];
