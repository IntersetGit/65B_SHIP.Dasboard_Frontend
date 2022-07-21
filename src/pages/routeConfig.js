import React from 'react';
// import {BiAlignLeft} from 'react-icons/bi';
import AcessIcon from '../assets/icon/Access Control.png';
import EquipmentIcon from '../assets/icon/Equipment.png';
import NotificationIcon from '../assets/icon/Notification.png';
import PeopleTrackingIcon from '../assets/icon/People Tracking.png';
// import PeopleIcon from '../assets/icon/people.png'
import ScaffoldingIcon from '../assets/icon/Scaffolding.png';
// import ToolsIcon from '../assets/icon/tools.png'
import VechicleIcon from '../assets/icon/Vechicle.png';
import WorkpermistIcon from '../assets/icon/Work Permit.png';
import Icon from '@ant-design/icons';

const routesConfig = [
  {
    id: 'app',
    title: 'Mornitor',
    messageId: 'sidebar.sample',
    type: 'group',
    children: [
      {
        _id: "62a4d45011b91829618a4413",
        id: 'workpermit',
        title: 'workpermit',
        messageId: 'sidebar.sample.page1',
        message: "Work Permit",
        type: 'item',
        icon: (
          <Icon
            component={() => (
              <img src={WorkpermistIcon} width='20' style={{ marginTop: -10 }} />
            )}
          />
        ),
        path: '/workpermit',

      },
      {
        _id: '62a4d4a822bdf92ba30d162b',
        id: 'vehicle',
        title: 'vehicle',
        messageId: 'sidebar.sample.page2',
        type: 'item',
        icon: (
          <Icon
            component={() => (
              <img src={VechicleIcon} width='20' style={{ marginTop: -10 }} />
            )}
          />
        ),
        path: '/vehicle',
      },
      {
        _id: '62a4d4b922bdf92ba30d162f',
        id: 'equipment',
        title: 'equipment',
        messageId: 'sidebar.sample.page3',
        type: 'collapse',
        icon: (
          <Icon
            component={() => (
              <img src={EquipmentIcon} width='20' style={{ marginTop: -10 }} />
            )}
          />
        ),
        children: [
          {
            _id: "62d3fe8e03036b7b55c5af2c",
            id: 'อุปกรณ์เสี่ยง',
            title: 'อุปกรณ์เสี่ยง',
            messageId: 'sidebar.sample.page3.sub1',
            message: "อุปกรณ์เสี่ยง",
            type: 'item',
            icon: (
              <Icon
                component={() => (
                  <img src={EquipmentIcon} width='20' style={{ marginTop: -10 }} />
                )}
              />
            ),
            path: '/equipment/risk',
          },
          {
            _id: "62d3ff0303036b7b55c5af87",
            id: 'ภาพรวมอุปกรณ์ทั้งหมด',
            title: 'ภาพรวมอุปกรณ์ทั้งหมด',
            messageId: 'sidebar.sample.page3.sub2',
            message: "ภาพรวมอุปกรณ์ทั้งหมด",
            type: 'item',
            icon: (
              <Icon
                component={() => (
                  <img src={EquipmentIcon} width='20' style={{ marginTop: -10 }} />
                )}
              />
            ),
            path: '/equipment/all',
          },
        ]
      },
      {
        _id: "62a4d4c622bdf92ba30d1633",
        id: 'scaffolding',
        title: 'scaffolding',
        messageId: 'sidebar.sample.page4',
        type: 'item',
        icon: (
          <Icon
            component={() => (
              <img src={ScaffoldingIcon} width='20' style={{ marginTop: -10 }} />
            )}
          />
        ),
        path: '/scaffolding',
      },
      {
        _id: "62a4d4de22bdf92ba30d1637",
        id: 'peopleTracking',
        title: 'peopleTracking',
        messageId: 'sidebar.sample.page5',
        type: 'item',
        icon: (
          <Icon
            component={() => (
              <img
                src={PeopleTrackingIcon}
                width='20'
                style={{ marginTop: -10 }}
              />
            )}
          />
        ),
        path: '/peopletracking',
      },
      {
        _id: "62a4d4fa22bdf92ba30d163b",
        id: 'acesscontrol',
        title: 'acesscontrol',
        messageId: 'sidebar.sample.page6',
        type: 'item',
        icon: (
          <Icon
            component={() => (
              <img src={AcessIcon} width='20' style={{ marginTop: -10 }} />
            )}
          />
        ),
        path: '/accesscontrol',
      },
      // {
      //   id: 'equipment',
      //   title: 'equipment',
      //   messageId: 'sidebar.sample.page3',
      //   type: 'item',
      //   icon: (
      //     <Icon
      //       component={() => (
      //         <img src={EquipmentIcon} width='20' style={{ marginTop: -10 }} />
      //       )}
      //     />
      //   ),
      //   path: '/equipment',
      // },
      // {
      //   id: 'page-7',
      //   title: 'Page 7',
      //   messageId: 'sidebar.sample.page7',
      //   type: 'item',
      //   icon: <Icon component={() => (<img src={NotificationIcon} width="20" />)} />,
      //   path: '/notification',
      // },

      // {
      //   id: 'equipmentall',
      //   title: 'equipmentall',
      //   messageId: 'sidebar.sample.page3',
      //   type: 'collapse',
      //   icon: (
      //     <Icon
      //       component={() => (
      //         <img src={EquipmentIcon} width='20' style={{ marginTop: -10 }} />
      //       )}
      //     />
      //   ),
      //   children: [
      //     {
      //       id: 'equipment2',
      //       title: 'equipment2',
      //       messageId: 'sidebar.sample.page3',
      //       type: 'item',
      //       icon: (
      //         <Icon
      //           component={() => (
      //             <img src={EquipmentIcon} width='20' style={{ marginTop: -10 }} />
      //           )}
      //         />
      //       ),
      //       path: '/equipment2',

      //     },
      //   ],
      // },
    ],
  },
];
export default routesConfig;
