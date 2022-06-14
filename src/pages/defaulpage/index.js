import React from 'react';
import {RoutePermittedRole} from '../../shared/constants/AppEnums';
import './index.style.less';

const Vehicle = React.lazy(() => import('./vehicle'));
const Equipment = React.lazy(() => import('./equipment'));
const Workpermit = React.lazy(() => import('./workpermit'));
const Scaffolding = React.lazy(() => import('./scaffolding'));
const People = React.lazy(() => import('./people'));
const Acesscontrol = React.lazy(() => import('./acesscontrol'));

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
  {
    permittedRole: RoutePermittedRole.user,
    path: '/scaffolding',
    element: <Scaffolding />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/peopleTracking',
    element: <People />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/accesscontrol',
    element: <Acesscontrol />,
  },
];
