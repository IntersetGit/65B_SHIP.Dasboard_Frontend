import React from 'react';
import { Dropdown, Input, Layout, Menu } from 'antd';
import './index.style.less';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import PropTypes from 'prop-types';
import AppLogo from '../components/AppLogo';
import { useIntl } from 'react-intl';
import AppLanguageSwitcher from '../../AppLanguageSwitcher';
import AppHeaderMessages from '../../AppHeaderMessages';
import AppNotifications from '../../AppNotifications';
import { useAuthMethod, useAuthUser } from '../../../utility/AuthHooks';
import { Avatar, List, Comment } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../../utility/AppContextProvider/ThemeContextProvider';

import UserInfo from '../../../core/AppLayout/components/UserInfo';
const AppHeader = ({ isCollapsed, onToggleSidebar }) => {
  const { Header } = Layout;
  const { Search } = Input;
  const { messages } = useIntl();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { logout } = useAuthMethod();
  const { themeMode } = useThemeContext();

  const menuMobile = (
    <Menu>
      <AppHeaderMessages />
      <AppNotifications />
      <AppLanguageSwitcher />
    </Menu>
  );

  const menu = (
    <List className='dropdown-list'>
      <List.Item onClick={() => navigate('/my-profile')}>My Profile</List.Item>
      <List.Item onClick={() => logout()}>Logout</List.Item>
    </List>
  );

  const getUserAvatar = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
  };
  return (
    <Header className='app-header-mini-sidebar'>

      {React.createElement(
        isCollapsed ? AiOutlineMenuUnfold : AiOutlineMenuFold,
        {
          className: isCollapsed ? 'triggerhide' : 'trigger',
          onClick: onToggleSidebar,
        },
      )}

      <div className='headerstatus' >
        <div className='textstatus'>
          <p>Total</p>
          <p>20</p>
        </div>
        <div className='textstatus'>
          <p>Open</p>
          <p>50</p>
        </div>
        <div className='textstatus'>
          <p>Warning</p>
          <p>50</p>
        </div>
        <div className='textstatus'>
          <p>Close</p>
          <p>50</p>
        </div>

      </div>

      {/* <AppLogo /> */}

      {/* <Search
        className='header-search-mini-sidebar'
        placeholder={messages['common.searchHere']}
      />
      */}
      {/* <div className='app-header-mini-sidebar-sectionDesktop'>
        <AppLanguageSwitcher />
        <AppHeaderMessages />
        <AppNotifications />
      </div> */}
      <div style={{ right: 0, position: 'absolute' }}>
        <UserInfo />
      </div>


      {/* <div className='app-header-mini-sidebar-section-mobile'>
        <Dropdown overlay={menuMobile} trigger={['click']}>
          <a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
            <FiMoreVertical />
          </a>
        </Dropdown>
      </div> */}
    </Header>
  );
};

export default AppHeader;

AppHeader.propTypes = {
  isCollapsed: PropTypes.bool,
  onToggleSidebar: PropTypes.func,
};
