import React from 'react';
import './index.style.less';
import AuthWrapper from '../AuthWrapper';
import AppPageMetadata from '../../../@crema/core/AppPageMetadata';
import SignInFirebase from './SigninFirebase';
import SigninJwtAuth from './SigninJwtAuth';
import Login from './Login'

const Signin = () => {
  return (
    <AuthWrapper>
      <AppPageMetadata title='Login' />
      <SigninJwtAuth />
    </AuthWrapper>
  );
};

export default Signin;
