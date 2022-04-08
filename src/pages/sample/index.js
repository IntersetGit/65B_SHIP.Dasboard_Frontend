import React from 'react';
import {RoutePermittedRole} from '../../shared/constants/AppEnums';

const Page1 = React.lazy(() => import('./Page1'));
const Page2 = React.lazy(() => import('./Page2'));
const Workpermit = React.lazy(() => import('./workpermit'));

export const samplePagesConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/workpermit',
    element: <Workpermit />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/sample/page-2',
    element: <Page2 />,
  },
];
