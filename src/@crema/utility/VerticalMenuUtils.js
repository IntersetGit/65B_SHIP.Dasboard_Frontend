import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import React from 'react';
import routesConfig from '../../pages/routeConfig';
import { useIntl } from 'react-intl';
import { useSidebarContext } from './AppContextProvider/SidebarContextProvider';
import { useAuthUser } from './AuthHooks';
import Icon from '@ant-design/icons';

function getStyles(item, sidebarColorSet, isSidebarBgImage, index, isGroup) {
  const { pathname } = useLocation();
  // const selectedKeys = pathname.substr(1);
  const selectedKeys = pathname;
  const defaultOpenKeys = selectedKeys.split('/');
  if (index === 0 || isGroup) {
    return {
      color: sidebarColorSet.sidebarTextColor,
      backgroundColor: isSidebarBgImage ? '' : sidebarColorSet.sidebarBgColor,
    };
  } else {
    const isActive = defaultOpenKeys[index] === item.id;
    return {
      color: isActive
        ? sidebarColorSet.sidebarMenuSelectedTextColor
        : sidebarColorSet.sidebarTextColor,
      backgroundColor: isActive
        ? sidebarColorSet.sidebarMenuSelectedBgColor
        : isSidebarBgImage
          ? ''
          : sidebarColorSet.sidebarBgColor,
    };
  }
}

const renderMenuItemChildren = (item) => {
  const { icon, messageId, path, message } = item;
  const { messages } = useIntl();

  if (path && path.includes('/'))
    return (
      <Link to={path}>
        {icon &&
          (React.isValidElement(icon) ? (
            <span className='ant-menu-item-icon'>{icon}</span>
          ) : (
            <icon className='ant-menu-item-icon' />
          ))}
        <span data-testid={messageId.toLowerCase + '-nav'}>
          {message ?? messages[messageId]}
        </span>
        <span style={{ position: 'absolute', right: 5 }}>
          <WarningFilled style={{ color: '#ff7a0e' }} />
        </span>
      </Link>
    );
  else {
    return (
      <>
        {icon &&
          (React.isValidElement(icon) ? (
            <span className='ant-menu-item-icon'>{icon}</span>
          ) : (
            <icon className='ant-menu-item-icon' />
          ))}
        <span data-testid={messageId.toLowerCase + '-nav'}>
          {message ?? messages[messageId]}
        </span>
      </>
    );
  }
};

const renderMenuItem = (item, sidebarColorSet, isSidebarBgImage, index) => {
  return item.type === 'collapse' ? (
    <Menu.SubMenu
      style={getStyles(item, sidebarColorSet, isSidebarBgImage, index, true)}
      key={item.path ? item.path : item.id}
      title={renderMenuItemChildren(item, sidebarColorSet, isSidebarBgImage)}
    >
      {item.children.map((item) =>
        renderMenuItem(item, sidebarColorSet, isSidebarBgImage, index + 1),
      )}
    </Menu.SubMenu>
  ) : (
    <Menu.Item
      key={item.id}
      style={getStyles(item, sidebarColorSet, isSidebarBgImage, index)}
    >
      {item.children
        ? item.children
        : renderMenuItemChildren(item, sidebarColorSet, isSidebarBgImage)}
    </Menu.Item>
  );
};

const renderMenu = (item, sidebarColorSet, isSidebarBgImage, index) => {
  return item.type === 'group' ? (
    <Menu.ItemGroup
      style={getStyles(item, sidebarColorSet, isSidebarBgImage, index, true)}
      key={item.path ? item.path : item.id}
      title={renderMenuItemChildren(item, sidebarColorSet, isSidebarBgImage)}
    >
      {item.children.map((item) =>
        renderMenuItem(item, sidebarColorSet, isSidebarBgImage, index + 1),
      )}
    </Menu.ItemGroup>
  ) : (
    <Menu.Item
      key={item.id}
      exact={item.exact}
      style={getStyles(item, sidebarColorSet, isSidebarBgImage, index)}
    >
      {item.children
        ? item.children
        : renderMenuItemChildren(
          item,
          sidebarColorSet,
          isSidebarBgImage,
          index,
        )}
    </Menu.Item>
  );
};

export const getRouteMenus = () => {
  const { sidebarColorSet } = useSidebarContext();
  const { isSidebarBgImage } = useSidebarContext();
  const { user } = useAuthUser()



  // console.log('  useAuthUser() =>>>>>>>>>;', user)

  const imgSrc = {
    "62a4d45011b91829618a4413": "/assets/icon/Work Permit.png",
    "62a4d4a822bdf92ba30d162b": "/assets/icon/Vechicle.png",
    "62a4d4b922bdf92ba30d162f": "/assets/icon/Equipment.png",
    "62a4d4c622bdf92ba30d1633": "/assets/icon/Scaffolding.png",
    "62a4d4de22bdf92ba30d1637": "/assets/icon/People Tracking.png",
    "62a4d4fa22bdf92ba30d163b": "/assets/icon/Access Control.png",
  }

  console.log('user.menu', user.menu)
  const routesConfigAuth = routesConfig.map((route) => {
    let groupmenu = route.children.filter((listmenu) => {
      if (user.menu.some((i) => i._id == listmenu._id)) {
        // console.log(user.menu.some((i)=>i.url == listmenu.path))
        return listmenu
      } 
      // else if (listmenu.type == 'group') {
      //   // console.log(user.menu.some((i)=>i.url == listmenu.path))
      // }

    })
    // console.log('groupmenu', groupmenu)
    let setroute = { ...route, children: groupmenu }
    return setroute
  })
  // console.log('routesConfigAuth', routesConfigAuth)
  
  // const children = user.menu.map((item) => {
  //   return {
  //     id: item.application_name,
  //     title: item.application_name,
  //     messageId: 'sidebar.sample.page1',
  //     message: item.application_name,
  //     type: 'item',
  //     icon: (
  //       <Icon
  //         component={() => (
  //           <img src={imgSrc[item._id]} width='20' style={{ marginTop: -10 }} />
  //         )}
  //       />
  //     ),
  //     path: item.url,
  //   }

  // })

  // const route = [
  //   {
  //     id: 'app',
  //     title: 'Mornitor',
  //     messageId: 'sidebar.sample',
  //     type: 'group',
  //     children,
  //   }
  // ]

  //  return routesConfig.map((route) =>
  //   renderMenu(route, sidebarColorSet, isSidebarBgImage, 0),
  // );

  return routesConfigAuth.map((route) =>
    renderMenu(route, sidebarColorSet, isSidebarBgImage, 0),
  );


};
