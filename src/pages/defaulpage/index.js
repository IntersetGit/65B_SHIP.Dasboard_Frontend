import React from 'react';
import {RoutePermittedRole} from '../../shared/constants/AppEnums';

const Vehicle = React.lazy(() => import('./vehicle'));
const Equipment = React.lazy(() => import('./equipment'));
const Workpermit = React.lazy(() => import('./workpermit'));

export const PagesConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/workpermit',
    element: <Workpermit />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/vehicle',
    element: <Vehicle />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/equipment',
    element: <Equipment />,
  },
];
