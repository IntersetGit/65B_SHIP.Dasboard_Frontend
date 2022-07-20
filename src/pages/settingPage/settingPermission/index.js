import React, { useEffect, useState } from 'react'
import { Table, Button, Form, Input, Typography, Tooltip, Checkbox, Tabs, Select, Tag, Divider, Drawer, Space, message, Modal } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined, ArrowRightOutlined, SaveFilled } from '@ant-design/icons';
import './index.style.less';
import { useNavigate } from 'react-router-dom';
import API from '../../../util/Api'
const { Title } = Typography;
const { TabPane } = Tabs;

import { Helmet } from 'react-helmet';
const SettingUser = () => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [state_table, setstate_table] = useState([]);
  const [state_role, setstate_role] = useState([]);
  const [visible, setVisible] = useState(false);
  const [idModal, setIdModal] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState({});

  const columns = [
    {
      title: 'สิทธิ์ผู้ใช้งาน',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
      filters: [
        {
          text: 'on',
          value: 'on',
        },
        {
          text: 'off',
          value: 'off',
        },
      ],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: 'workpermit',
      className: "column-1",
      children: [
        {
          title: <Tooltip title={`แสดงภาพรวมการขออนุญาตทำงาน โดยมี Icon สีแสดงแยกประเภทใบอนุญาตทำงาน`}>แสดงภาพรวมการขออนุญาตทำงาน...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงภาพรวมสถานะเปิด – ปิดใบอนุญาตทำงานโดยมี Icon สี แสดงสถานะใบอนุญาตทำงาน`}>แสดงภาพรวมสถานะเปิด – ปิด</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงสถานะอุปกรณ์ที่ Impairment โดยมี Icon สี แสดงสถานะอุปกรณ์`}>แสดงสถานะอุปกรณ์ที่ Impairment</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงการแจ้งเตือนรอบการวัดก๊าซ โดยมี Icon สี เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนรอบการวัดก๊าซ</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงการแจ้งเตือนเมื่อใบอนุญาตทำงานใกล้หมดอายุการขออนุญาตในแต่ละวัน ชั่วโมง โดยมี Icon สี เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนเมื่อใบอนุญาตทำงานใกล้หมดอายุ</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`ใช้ฟังก์ชันการค้นหาข้อมูล
        o	 รหัสพนักงานผู้ควบคุมงาน
        o	 หน่วยงานผู้ควบคุม
        o	 วัน-เวลา เริ่มต้น
        o	 วัน-เวลา สิ้นสุด
        o	 สถานที่ปฏิบัติงาน
        o	 สถานะ Work
        o	 ประเภทใบอนุญาต
        o	 หัวข้อการค้นหา
      โดยเมนู Search สามารถทำการเปิด-ปิด หน้าต่างการค้นหาได้ เพื่อเพิ่มพื้นที่การแสดงผลของ Dashboard`}>ใช้ฟังก์ชันการค้นหาข้อมูล</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
      ],
    },
    {
      title: 'Vehicle',
      className: "column-2",
      children: [
        {
          title: <Tooltip title={`แสดงภาพรวมยานพาหนะ โดยมี Icon แสดงแยกตามชนิดยานพาหนะ`}>แสดงภาพรวมยานพาหนะ...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`การแจ้งเตือนกรณียานพาหนะขับนอกเส้นทาง,
        ขับนอกพื้นที่ควบคุม (Geofencing) ตามใบขอ
        อนุญาตทำงาน, จอดในจุดที่ไม่ได้กำหนด
        หรือการใช้ความเร็วรถเกินความเร็วที่กำหนด
        โดยมี Icon สี เพื่อแจ้งเตือน `}>การแจ้งเตือนกรณียานพาหนะขับนอกเส้นทาง</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงภาพรวมยานพาหนะเข้า - ออก พื้นที่ โดยมี
        Icon แสดงแยกตามชนิดยานพาหนะ และจำนวน
        ยานพาหนะเข้า - ออก `}>แสดงภาพรวมยานพาหนะเข้า - ออก</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`การแจ้งเตือนกรณียานพาหนะไม่ได้รับอนุญาต
        ให้เข้าพื้นที่ตามใบขออนุญาตทำงาน Work Permit
        Online โดยมี Icon สี เพื่อแจ้งเตือน`}>การแจ้งเตือนกรณียานพาหนะไม่ได้รับอนุญาต</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`ใช้ฟังก์ชันการค้นหาข้อมูล
        o	 รหัสพนักงานผู้ควบคุมงาน
        o	 หน่วยงานผู้ควบคุมงาน
        o	 วัน-เวลา เริ่มต้น
        o	 วัน-เวลา สิ้นสุด
        o	 สถานที่ปฏิบัติงาน
        o	 สถานที่จอดรถตามพื้นที่
        o	 สถานะ Work
        o	 ประเภทรถ
      โดยเมนู Search สามารถทำการเปิด-ปิด หน้าต่างการค้นหาได้ เพื่อเพิ่มพื้นที่การแสดงผลของ Dashboard`}>ใช้ฟังก์ชันการค้นหาข้อมูล</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
      ],
    },
    {
      title: 'Equipment',
      className: "column-3",
      children: [
        {
          title: <Tooltip title={`แสดงภาพรวมอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้งอยู่ในพื้นที่ โดยมี Icon สี แสดงจุดที่มีการติดตั้งอุปกรณ์`}>แสดงภาพรวมอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้งอยู่ในพื้นที่...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`การแจ้งเตือนกรณีอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้งอยู่ในพื้นที่หมดอายุการตรวจสภาพโดยมี Icon สี เพื่อแจ้งเตือน`}>การแจ้งเตือนกรณีอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้งอยู่ในพื้นที่หมดอายุการตรวจสภาพโดยมี – ปิด</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`การแจ้งเตือนกรณีอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้ง
        อยู่ในพื้นที่ ใกล้หมดอายุการตรวจสภาพ, หมดอายุการตรวจสภาพ โดยมี Icon สี เพื่อแจ้งเตือนสถานะ`}>การแจ้งเตือนกรณีอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้ง</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`ภาพรวมการนำอุปกรณ์เข้า - ออก พื้นที่ โดยแสดง
        จำนวนอุปกรณ์เข้า - ออก `}>ภาพรวมการนำอุปกรณ์เข้า - ออก</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงการแจ้งเตือนอุปกรณ์ที่ยังไม่ได้นำออกจากพื้นที่ โดยแจ้งเตือนตามรายการอุปกรณ์ที่มีการขออนุญาตนำเข้าพื้นที่ในแต่ละวัน`}>แสดงการแจ้งเตือนอุปกรณ์ที่ยังไม่ได้นำออกจากพื้นที่...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`ใช้ฟังก์ชันการค้นหาข้อมูล
        o	 รหัสพนักงานผู้ควบคุมงาน
        o	 หน่วยงานผู้ควบคุม
        o	 วัน-เวลา เริ่มต้น
        o	 วัน-เวลา สิ้นสุด
        o	 สถานที่ปฏิบัติงาน
        o	 ประเภทอุปกรณ์
      โดยเมนู Search สามารถทำการเปิด-ปิด หน้าต่างการค้นหาได้ เพื่อเพิ่มพื้นที่การแสดงผลของ Dashboard`}>ใช้ฟังก์ชันการค้นหาข้อมูล...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
      ],
    },
    {
      title: 'Scaffolding',
      className: "column-4",
      children: [
        {
          title: <Tooltip title={`แสดงภาพรวมการติดตั้งนั่งร้าน โดยมี Icon สี แสดงจุดที่มีการติดตั้งนั่งร้าน`}>แสดงภาพรวมการติดตั้งนั่งร้าน...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงการแจ้งเตือนกรณีนั่งร้านที่ติดตั้งในพื้นที่หมดอายุการตรวจสภาพ โดยมี Icon สี เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนกรณีนั่งร้านที่ติดตั้งในพื้นที่หมดอายุการตรวจสภาพ...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`การแจ้งเตือนกรณีนั่งร้านที่ติดตั้งในพื้นที่ใกล้หมดอายุการตรวจสภาพ, หมดอายุการตรวจสภาพ โดยมี Icon สี เพื่อแจ้งเตือนสถานะ`}>การแจ้งเตือนกรณีนั่งร้านที่ติดตั้งในพื้นที่ใกล้หมดอายุการตรวจสภาพ...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`ใช้ฟังก์ชันการค้นหาข้อมูล
        o	 รหัสพนักงานผู้ควบคุมงาน
        o	 หน่วยงานผู้ควบคุม
        o	 วัน-เวลา เริ่มต้น
        o	 วัน-เวลา สิ้นสุด
        o 	 สถานที่ปฏิบัติงาน
        o	 ประเภทนั่งร้าน
      โดยเมนู Search สามารถทำการเปิด-ปิด หน้าต่างการค้นหาได้ เพื่อเพิ่มพื้นที่การแสดงผลของ Dashboard`}>ใช้ฟังก์ชันการค้นหาข้อมูล...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
      ],
    },
    {
      title: 'People Tracking',
      className: "column-5",
      children: [
        {
          title: <Tooltip title={`แสดงภาพรวมบุคคลที่ปฏิบัติงาน โดยมี Icon แสดงแยกตามประเภทกลุ่มบุคคล ได้แก่ ผู้รับเหมา, เจ้าหน้าที่ความปลอดภัย, ผู้เฝ้าระวังไฟ เป็นต้น`}>แสดงภาพรวมบุคคลที่ปฏิบัติงาน...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงการแจ้งเตือนกรณีบุคคลอยู่นิ่ง หรืออยู่นอกพื้นที่การขออนุญาตทำงานมากกว่า 30 นาทีขึ้นไป โดยมี Icon สี เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนกรณีบุคคลอยู่นิ่ง</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงการแจ้งเตือนกรณีบุคคลเกิดเหตุฉุกเฉิน ได้แก่
        ล้ม กดปุ่ม SOS โดยมี Icon สี และสัญญาณเพื่อ
        แจ้งเตือน`}>แสดงการแจ้งเตือนกรณีบุคคลเกิดเหตุฉุกเฉิน</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`การแจ้งเตือนกรณีบุคคลอยู่ในพื้นที่กระบวนการผลิต
        นอกเวลาที่ขออนุญาตทำงาน หรือได้ทำการปิด
        ใบอนุญาตทำงานเสร็จสิ้น โดยมี Icon สี และสัญญาณ
        เพื่อแจ้งเตือน`}>การแจ้งเตือนกรณีบุคคลอยู่ในพื้นที่กระบวนการผลิต...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`ใช้ฟังก์ชันการค้นหาข้อมูล
        o	 รหัสผู้ควบคุมงาน
        o	 หน่วยงานผู้ควบคุม
        o	 วัน-เวลา เริ่มต้น
        o	 วัน-เวลา สิ้นสุด
        o	 สถานที่ปฏิบัติงาน
        o	 ประเภทกลุ่มบุคคล
      โดยเมนู Search สามารถทำการเปิด-ปิด หน้าต่างการค้นหาได้ เพื่อเพิ่มพื้นที่การแสดงผลของ Dashboard`}>ใช้ฟังก์ชันการค้นหาข้อมูล...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
      ],
    },
    {
      title: 'Access Control',
      className: "column-6",
      children: [
        {
          title: <Tooltip title={`แสดงภาพรวมบุคคลที่เข้า - ออก พื้นที่ โดย มี Icon แสดงแยกตามประเภทกลุ่มบุคคล และแสดงจำนวนบุคคลเข้า-ออก (ใช้ข้อมูลจากพื้นที่ที่สแกนอุปกรณ์ล่าสุด)`}>แสดงภาพรวมบุคคลที่เข้า-ออก...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงภาพรวมการแลกบัตรเข้า - ออก พื้นที่ แสดงจำนวนบุคคลที่มีการแลกบัตรเข้า - ออก`}>แสดงภาพรวมการแลกบัตรเข้า - ออก</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`แสดงการแจ้งเตือนกรณี อุปกรณ์ Access Control
        Offline โดยมี Pop-up แสดง เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนกรณี อุปกรณ์ Access Control...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
        {
          title: <Tooltip title={`ใช้ฟังก์ชันการค้นหาข้อมูล
        o	 รหัสผู้ควบคุมงาน
        o	 หน่วยงานผู้ควบคุม
        o	 วัน-เวลา เริ่มต้น
        o	 วัน-เวลา สิ้นสุด
        o	 สถานที่ปฏิบัติงาน
        o	 อุปกรณ์ Access Control
        o	 ประเภทกลุ่มบุคคล
      โดยเมนู Search สามารถทำการเปิด-ปิด หน้าต่างการค้นหาได้ เพื่อเพิ่มพื้นที่การแสดงผลของ Dashboard`}>ใช้ฟังก์ชันการค้นหาข้อมูล...</Tooltip>,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          align: 'center'
        },
      ],
    },
    {
      title: 'จัดการ',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      fixed: 'right',
      render: () => <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Tooltip title="ลบRole">
          <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} />
        </Tooltip>
      </div>
    },
  ];
  const data = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      key: i,
      name: `Role ${i}`,
      age: 32,
      companyName: <Checkbox checked={Math.round(Math.random())} />,
    });
  }


  const ColumnRole = [
    {
      title: 'สิทธิ์ผู้ใช้งาน',
      dataIndex: 'group_name',
      key: 'group_name',
      width: 40,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 40,
      render: (row, recoard) => (row ? <span style={{ color: 'green' }}>เปิดใช้งาน</span> : <span style={{ color: 'red' }}>ปิดใช้งาน</span>)
    },
    {
      title: 'จัดการ',
      dataIndex: 'gender',
      key: 'gender',
      width: 10,
      align: 'center',
      fixed: 'right',
      render: (row, recoard) => <Space>
        <Tooltip title="แก้ไขRole">
          <Button type="primary" shape="circle" onClick={() => onClickEditGroup(recoard._id)} icon={<EditOutlined />} />
        </Tooltip>
        {/* <Tooltip title="ลบRole">
        <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} />
      </Tooltip> */}
      </Space>
    },
  ]


  useEffect(() => {
    onInit()
  }, []);

  const onInit = async () => {
    try {
      setLoading(true)
      await Promise.all([_API_GETPERMISSION(), _API_GETROLE()])
      setLoading(false)
      setPermission({})
    } catch (error) {
      setLoading(false)
    }
  };

  const onClickEditGroup = async (id) => {
    try {
      // console.log('id', id)
      const { data } = await API.get(`/admin/group/byid/${id}`);
      console.log('data', data)
      if (data.Status === "success") {
        setIdModal(id);
        form.setFieldsValue({
          group_name: data.Message.group_name
        })
        setIsModalVisible(true)
      } else {
        message.error(data.Message)
      }
    } catch (error) {
      console.log('error', error)
      message.error("มีบางอย่างผิดพลาด")
    }
  }

  const handleOk = () => {
    form.submit()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setIdModal(null);
  }

  const onFinish = async (value) => {
    try {
      // console.log('value', value)
      const { data } = await API.put(`/admin/group/put/${idModal}`, {
        group_name: value.group_name
      });
      if (data.Status === "success") {
        message.success("บันทึกสำเร็จ")
        handleCancel()
        onInit()
      } else {
        message.error(data.Message)
      }
    } catch (error) {
      message.error("มีบางอย่างผิดพลาด")
      console.log('error', error)
    }
  }

  const onFinishFailed = (error) => {
    message.warning("กรอกข้อมูลให้ครบถ้วน")
    console.log('error', error)
  }


  const _API_GETPERMISSION = async () => {
    let permission = await API.get('/admin/application/all');
    if (permission.status == 200) {
      let { Message: { data } } = permission.data;
      let datamap = data.map((item, index) => {
        item.key = index;
        item.children = item.child;
        return {
          ...item
        }
      })
      // console.log('_API_GETPERMISSION :>> ', datamap);
      setstate_table(datamap);
    }
  }

  var alreadyDone = [];
  const randomValueFromArray = (myArray) => {
    if (alreadyDone.length === 0) {
      for (var i = 0; i < myArray.length; i++) alreadyDone.push(i);
    }
    var randomValueIndex = Math.floor(Math.random() * alreadyDone.length);
    var indexOfItemInMyArray = alreadyDone[randomValueIndex];
    alreadyDone.splice(randomValueIndex, 1);
    return myArray[indexOfItemInMyArray];
  };
  let colorRandom = ["#111827", "#b831d4", "#202cd3", "#f37d2f", "#f00116", "#21b6a1", "#927edd", "#9b2693", "#4a5289", "#d91373", "#551f15", "#2c208b", "#5c715c", "#3d1ef6", `#${(Math.floor(Math.random() * 16777215).toString(16))}`]
  const _API_GETROLE = async () => {
    // console.log('randomValueFromArray :>> ', randomValueFromArray(colorRandom));
    let role = await API.get('/admin/group/all');
    if (role.status == 200) {
      let { Message: { data } } = role.data;
      let datamap = data.map((item, index) => {
        item.value = item._id;
        item.label = item.group_name;
        // item.color = randomValueFromArray(colorRandom);
        item.color = colorRandom[index];
        return {
          ...item
        }
      })
      // console.log('_API_GETROLE :>> ', datamap);
      setstate_role(datamap);
    }
  }
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    let color = state_role.find((i) => i._id == value);
    // console.log('color :>> ', state_role);
    return (
      <Tag
        color={color?.color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };

  const columns2 = [
    {
      title: <b>ชื่อระบบ</b>,
      // dataIndex: 'application_name',
      key: 'application_name',
      render: (row, recoard) => (<b>{row.config ? row.config.description : row.application_name}</b>),
      sorter: (a, b) => a.config ? a.config.description : a.application_name - b.config ? b.config.description : b.application_name,
    },
    {
      title: <b>สิทธิ์การเข้าถึงระบบ</b>,
      dataIndex: 'permission',
      key: 'permission',
      width: '50%',
      render: (row, recoard) => (
        <Select
          mode="multiple"
          showArrow
          tagRender={tagRender}
          defaultValue={recoard?.role?.map((i) => i.group_id)}
          onChange={value => onChangePermission(value, recoard._id)}
          style={{
            width: '100%',
          }}
          options={state_role}
        />
      )
    },

  ];


  const onChangePermission = (value, id) => {
    // console.log('value', value, id)
    const _permission = { ...permission }
    _permission[id] = value;
    setPermission(_permission)
  }

  const saveFinishPermission = async () => {
    try {
      // console.log('permission', permission)

      const awaitArr = []
      for (const [id, value] of Object.entries(permission)) {
        const model = {
          role: []
        };
        value.forEach(_id => {
          model.role.push({
            "group_id": _id,
            "get": 1,
            "put": 1,
            "post": 1,
            "delete": 1
          })
        });
        awaitArr.push(updateApplication(id, model));
      }

      await Promise.allSettled(awaitArr);
      message.success("บันทึกสำเร็จ")
      onInit()

    } catch (error) {
      message.error("มีบางอย่างผิดพลาด!!")
      console.log('error', error)
    }
  }

  const updateApplication = async (id, model) => {
    return await API.put(`admin/application/put/${id}`, model)
  }

  const onCloseOpen = () => {
    setVisible(!visible);
  };
  return (
    <>
      <Helmet>
        <title>จัดการPermission</title>
      </Helmet>

      <div className="container" style={{ marginTop: 12 }}>
        <div className="head">
          <Title >จัดการPermission</Title>
          <Button type='primary' shape='round' onClick={onCloseOpen} >จัดการกลุ่มผู้ใช้งาน<ArrowRightOutlined /></Button>
        </div>
        <div className="table-serch">
          <div className='filterSerch' style={{ margin: '12px 0px' }}>
            <Divider orientation="left">กลุ่มผู้ใช้งาน</Divider>
            <div>
              {state_role.map((i, index) => (
                <Tag key={index.toString()} color={i.color}>{i.group_name}</Tag>
              ))}
            </div>
          </div>
          <Button icon={<SaveFilled />} style={{ float: 'right' }} type='primary' size='small' onClick={saveFinishPermission} >บันทึกการเปลียนแปลง</Button>
          {/* <Table
          bordered
          className='tablepermission'
          columns={columns}
          dataSource={data}
          rowKey={(i, index) => index}
          scroll={{
            x: 1500,
            y: 300,
          }}
        /> */}
          <Table
            loading={loading}
            className='tablepermission'
            bordered
            columns={columns2}
            // rowSelection={{ ...rowSelection, checkStrictly }}
            dataSource={state_table}
          />
          <Drawer title="จัดการกลุ่มผู้ใช้งาน" size={"large"} placement="right" onClose={onCloseOpen} visible={visible}>
            <Table
              bordered
              className='tablepermission'
              columns={ColumnRole}
              dataSource={state_role}
              rowKey={(i, index) => index}

            />

          </Drawer>

          <Modal title="แก้ไขกลุ่มผู้ใช้งาน" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form

              form={form}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >

              <Form.Item
                name="group_name"
                label={"สิทธิ์ผู้ใช้งาน"}
              >
                <Input />
              </Form.Item>

            </Form>
          </Modal>
        </div>
      </div>
    </>


  )
}

export default SettingUser