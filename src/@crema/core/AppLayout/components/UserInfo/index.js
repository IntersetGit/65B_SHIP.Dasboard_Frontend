import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Avatar, Dropdown, List } from 'antd';
import { FaChevronDown } from 'react-icons/fa';
import './index.style.less';
import { useThemeContext } from '../../../../utility/AppContextProvider/ThemeContextProvider';
import { useAuthMethod, useAuthUser } from '../../../../utility/AuthHooks';
import { useSidebarContext } from '../../../../utility/AppContextProvider/SidebarContextProvider';
import PropTypes from 'prop-types';
import { MenuFoldOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';

const UserInfo = ({ hasColor, onToggleSidebar, children }) => {
  const { themeMode } = useThemeContext();
  const { logout } = useAuthMethod();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { sidebarColorSet } = useSidebarContext();
  const { isSidebarBgImage } = useSidebarContext();

  const getUserAvatar = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
  };

  const menu = (
    <List className='dropdown-list'>
      <List.Item onClick={() => navigate('/my-profile')}>My Profile</List.Item>
      <List.Item onClick={() => logout()}>Logout</List.Item>
    </List>
  );

  return (
    <>
      {hasColor ? (
        <div
          style={{
            backgroundColor: isSidebarBgImage
              ? ''
              : sidebarColorSet.sidebarHeaderColor,
            color: sidebarColorSet.sidebarTextColor,
          }}
          className={clsx('cr-user-info cr-user-info-hasColor', {
            light: themeMode === 'light',
          })}
        >
          {children ? (
            <div className='user-profile-dropdown'>
              <a className='cr-user-info-inner ant-dropdown-link'>
                <span className='cr-user-info-content'>
                  <span className='cr-user-name-info'>
                    <h3
                      className={clsx('cr-user-name text-truncate', {
                        light: themeMode === 'light',
                      })}
                    >
                      {children}
                    </h3>
                  </span>
                </span>
                <Avatar
                  onClick={onToggleSidebar}
                  icon={<MenuFoldOutlined style={{ fontSize: 20 }} />}
                  className='cr-user-info-avatar'
                />
              </a>
            </div>
          ) : (
            <Dropdown
              className='user-profile-dropdown'
              overlay={menu}
              trigger={['click']}
              placement='bottomRight'
              overlayStyle={{
                zIndex: 1052,
                minWidth: 150,
              }}
            >
              <a className='cr-user-info-inner ant-dropdown-link'>
                {user.photoURL ? (
                  <Avatar className='cr-user-info-avatar' src={user.photoURL} />
                ) : (
                  <Avatar className='cr-user-info-avatar'>
                    {getUserAvatar()}
                  </Avatar>
                )}
                <span className='cr-user-info-content'>
                  <span className='cr-user-name-info'>
                    <h3
                      className={clsx('cr-user-name text-truncate', {
                        light: themeMode === 'light',
                      })}
                    >
                      {user.displayName ? user.displayName : 'admin user '}
                    </h3>
                    <span className='cr-user-arrow'>
                      <FaChevronDown />
                    </span>
                  </span>
                  <span className='cr-user-designation text-truncate'>
                    System Manager
                  </span>
                </span>
              </a>
            </Dropdown>
          )}
        </div>
      ) : (
        <div
          className={clsx('cr-user-info', {
            light: themeMode === 'light',
          })}
        >
          <Dropdown
            className='user-profile-dropdown'
            overlay={menu}
            trigger={['click']}
            placement='bottomRight'
            overlayStyle={{
              zIndex: 1052,
              minWidth: 150,
            }}
          >
            <a className='cr-user-info-inner ant-dropdown-link'>
              {user.photoURL ? (
                <Avatar className='cr-user-info-avatar' src={user.photoURL} />
              ) : (
                <Avatar className='cr-user-info-avatar'>
                  {getUserAvatar()}
                </Avatar>
              )}
              <span className='cr-user-info-content user-hide'>
                <span className='cr-user-name-info'>
                  <h3
                    className={clsx('cr-user-name text-truncate', {
                      light: themeMode === 'light',
                    })}
                  >
                    {user.displayName ? user.displayName : '-'}
                  </h3>
                  <span className='cr-user-arrow'>
                    <FaChevronDown />
                  </span>
                </span>
                <span className='cr-user-designation text-truncate'>
                  {isPlainObject(user.group) ? user.group.group_name ?? "-" : '-'}
                </span>
              </span>
            </a>
          </Dropdown>
        </div>
      )}
    </>
  );
};

export default UserInfo;

UserInfo.propTypes = {
  hasColor: PropTypes.bool,
};
