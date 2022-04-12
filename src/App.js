import React from 'react';
import {Provider} from 'react-redux';

import './shared/styles/crema.less';
import {
  AppContextProvider,
  AppLayout,
  AppLocaleProvider,
  AppThemeProvider,
  AuthRoutes,
} from './@crema';
import configureStore from './redux/store';
import {BrowserRouter} from 'react-router-dom';
import './@crema/services/index';
import FirebaseAuthProvider from './@crema/services/auth/firebase/FirebaseAuthProvider';
import JWTAuthProvider from './@crema/services/auth/jwt-auth/JWTAuthProvider';

const store = configureStore();

const App = () => (
  <AppContextProvider>
    <Provider store={store}>
      <AppThemeProvider>
        <AppLocaleProvider>
          <BrowserRouter basename='/ship'>
            <JWTAuthProvider>
              <AuthRoutes>
                <AppLayout />
              </AuthRoutes>
            </JWTAuthProvider>
          </BrowserRouter>
        </AppLocaleProvider>
      </AppThemeProvider>
    </Provider>
  </AppContextProvider>
);

export default App;
