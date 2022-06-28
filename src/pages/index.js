import {errorPagesConfigs} from './errorPages';
import {authRouteConfig} from './auth';
import {initialUrl} from '../shared/constants/AppConst';
import Error403 from './errorPages/Error403';
import React from 'react';
import {PagesConfigs} from './defaulpage';
import Error404 from './errorPages/Error404';
import {profileConfig} from './profile';
import {settingConfig} from './settingPage'

const authorizedStructure = {
  fallbackPath: '/signin',
  unAuthorizedComponent: <Error403 />,
  routes: [...PagesConfigs, ...profileConfig,...settingConfig],
};

const unAuthorizedStructure = {
  fallbackPath: initialUrl,
  routes: authRouteConfig,
};

const anonymousStructure = {
  routes: errorPagesConfigs.concat([
    {
      path: '*',
      element: <Error404 />,
    },
  ]),
};

export {authorizedStructure, unAuthorizedStructure, anonymousStructure};
