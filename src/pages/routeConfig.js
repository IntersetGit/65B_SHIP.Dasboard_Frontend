import React from 'react';
// import {BiAlignLeft} from 'react-icons/bi';
import AcessIcon from '../assets/icon/Access Control.png'
import EquipmentIcon from '../assets/icon/Equipment.png'
import NotificationIcon from '../assets/icon/Notification.png'
import PeopleTrackingIcon from '../assets/icon/People Tracking.png'
// import PeopleIcon from '../assets/icon/people.png'
import ScaffoldingIcon from '../assets/icon/Scaffolding.png'
// import ToolsIcon from '../assets/icon/tools.png'
import VechicleIcon from '../assets/icon/Vechicle.png'
import WorkpermistIcon from '../assets/icon/Work Permit.png'
import Icon from '@ant-design/icons';
const routesConfig = [
  {
    id: 'app',
    title: 'Mornitor',
    messageId: 'sidebar.sample',
    type: 'group',
    children: [
      {
        id: 'workpermit',
        title: 'workpermit',
        messageId: 'sidebar.sample.page1',
        type: 'item',
        icon: <Icon component={() => (<img src={WorkpermistIcon} width="20" />)} />,
        path: '/workpermit',
      },
      {
        id: 'vehicle',
        title: 'vehicle',
        messageId: 'sidebar.sample.page2',
        type: 'item',
        icon: <Icon component={() => (<img src={VechicleIcon} width="20" />)} />,
        path: '/vehicle',
      },
      {
        id: 'equipment',
        title: 'equipment',
        messageId: 'sidebar.sample.page3',
        type: 'item',
        icon: <Icon component={() => (<img src={EquipmentIcon} width="20" />)} />,
        path: '/equipment',
      },
      {
        id: 'scaffolding',
        title: 'scaffolding',
        messageId: 'sidebar.sample.page4',
        type: 'item',
        icon: <Icon component={() => (<img src={ScaffoldingIcon} width="20" />)} />,
        path: '/scaffolding',
      },
      {
        id: 'peopleTracking',
        title: 'peopleTracking',
        messageId: 'sidebar.sample.page5',
        type: 'item',
        icon: <Icon component={() => (<img src={PeopleTrackingIcon} width="20" />)} />,
        path: '/peopleTracking',
      },
      {
        id: 'acesscontrol',
        title: 'acesscontrol',
        messageId: 'sidebar.sample.page6',
        type: 'item',
        icon: <Icon component={() => (<img src={AcessIcon} width="20" />)} />,
        path: '/acesscontrol',
      },
      // {
      //   id: 'page-7',
      //   title: 'Page 7',
      //   messageId: 'sidebar.sample.page7',
      //   type: 'item',
      //   icon: <Icon component={() => (<img src={NotificationIcon} width="20" />)} />,
      //   path: '/notification',
      // },
    ],
  },


];
export default routesConfig;
