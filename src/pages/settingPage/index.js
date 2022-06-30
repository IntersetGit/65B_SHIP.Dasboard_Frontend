import React from 'react';

const SettingUser = React.lazy(() => import('./settingUser'));
const SettingPermission = React.lazy(() => import('./settingPermission'));
export const settingConfig = [
  {
    path: '/setting-user',
    element: <SettingUser />,
  },
  {
    path: '/setting-permission',
    element: <SettingPermission />,
  },
];
