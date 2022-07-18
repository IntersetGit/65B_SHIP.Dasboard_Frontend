import React from 'react';
import { Col, Dropdown, Input, Layout, Menu, Row, Badge } from 'antd';
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
import { useSelector } from 'react-redux';

import UserInfo from '../../../core/AppLayout/components/UserInfo';
const AppHeader = ({ isCollapsed, onToggleSidebar }) => {
  const { Header } = Layout;
  const { Search } = Input;
  const { messages } = useIntl();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { logout } = useAuthMethod();
  const { themeMode } = useThemeContext();
  const StatusMap = useSelector(({ status }) => status);
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

  const IconLink = ({ number, text ,color ,img }) => (
    <a className="example-link">
      <Badge style={{ backgroundColor: `${color ? color :'#'+Math.floor(Math.random()*16777215).toString(16)}` }} count={number ? number : 0} showZero overflowCount={9999999999} />
      {" "+text}
      {img && <img style={{position:'relative',left:'5px'}} width={15} height={15} src={img} alt="Avatar"  />}
    </a>
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
      <div className='header'>
        <div className='box'>
          {Object.keys(StatusMap).length > 0 && (
            <div className='headerstatus'>
              <Row >
                {Object.keys(StatusMap).map((status,index) => {
                  return (
                    <Col key={index.toString()} lg={6} md={8} sm={12} xs={12}>
                      {/* <p>{status} : {StatusMap[status]}</p> */}
                      <IconLink
                        number={StatusMap[status].value}
                        text={status}
                        color={StatusMap[status].color}
                        img={StatusMap[status].img}
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
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
