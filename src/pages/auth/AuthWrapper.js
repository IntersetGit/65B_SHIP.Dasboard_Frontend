import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'antd';
import AppAnimateGroup from '../../@crema/core/AppAnimateGroup';
import './AuthWrapper.style.less';
import {AppInfoView} from '../../@crema';
import AppLogo from '../../@crema/core/AppLayout/components/AppLogo';

const AuthWrapper = ({children}) => {
  return (
    <AppAnimateGroup
      type='scale'
      animateStyle={{flex: 1}}
      delay={0}
      interval={10}
      duration={200}
    >
      <div className='auth-wrap' key={'wrap'}>
        <Card className='auth-card'>
          <div className='auth-wel-action'>
            <div className='auth-wel-content'>
              <p>Contractor Management Application</p>
            </div>

            <div className='auth-main-content '>
              <span className='ribbon6'>@PTT-V.1.0</span>
              <div className='auth-card-header'>
                <AppLogo />
              </div>
              {children}
            </div>
          </div>
        </Card>
      </div>
      <AppInfoView />
    </AppAnimateGroup>
  );
};

export default AuthWrapper;

AuthWrapper.propTypes = {
  children: PropTypes.node,
};
