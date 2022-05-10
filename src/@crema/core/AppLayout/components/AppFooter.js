import React from 'react';
import {Button, Layout} from 'antd';
import './AppFooter.style.less';
import {useLayoutContext} from '../../../utility/AppContextProvider/LayoutContextProvider';

const {Footer} = Layout;

const AppFooter = () => {
  const {footer} = useLayoutContext();

  if (footer) {
    return (
      <Footer className='app-main-footer'>
        <div className='footer-btn-view'>
          <p>Copy right PTT-SHIP 2022</p>
        </div>
      </Footer>
    );
  }
  return null;
};

export default AppFooter;
