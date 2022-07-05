import React from 'react'
import { Table, Button, Form, Input, Typography, Tooltip, Checkbox } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './index.style.less';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;


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
    className:"column-1",
    children: [
      {
        title: <Tooltip title={`แสดงภาพรวมการขออนุญาตทำงาน โดยมี Icon สีแสดงแยกประเภทใบอนุญาตทำงาน`}>แสดงภาพรวมการขออนุญาตทำงาน...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
        align:'center'
      },
      {
        title: <Tooltip title={`แสดงภาพรวมสถานะเปิด – ปิดใบอนุญาตทำงานโดยมี Icon สี แสดงสถานะใบอนุญาตทำงาน`}>แสดงภาพรวมสถานะเปิด – ปิด</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงสถานะอุปกรณ์ที่ Impairment โดยมี Icon สี แสดงสถานะอุปกรณ์`}>แสดงสถานะอุปกรณ์ที่ Impairment</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงการแจ้งเตือนรอบการวัดก๊าซ โดยมี Icon สี เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนรอบการวัดก๊าซ</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงการแจ้งเตือนเมื่อใบอนุญาตทำงานใกล้หมดอายุการขออนุญาตในแต่ละวัน ชั่วโมง โดยมี Icon สี เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนเมื่อใบอนุญาตทำงานใกล้หมดอายุ</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
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
         align:'center'
      },
    ],
  },
  {
    title: 'Vehicle',
    className:"column-2",
    children: [
      {
        title: <Tooltip title={`แสดงภาพรวมยานพาหนะ โดยมี Icon แสดงแยกตามชนิดยานพาหนะ`}>แสดงภาพรวมยานพาหนะ...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
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
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงภาพรวมยานพาหนะเข้า - ออก พื้นที่ โดยมี
        Icon แสดงแยกตามชนิดยานพาหนะ และจำนวน
        ยานพาหนะเข้า - ออก `}>แสดงภาพรวมยานพาหนะเข้า - ออก</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`การแจ้งเตือนกรณียานพาหนะไม่ได้รับอนุญาต
        ให้เข้าพื้นที่ตามใบขออนุญาตทำงาน Work Permit
        Online โดยมี Icon สี เพื่อแจ้งเตือน`}>การแจ้งเตือนกรณียานพาหนะไม่ได้รับอนุญาต</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
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
         align:'center'
      },
    ],
  },
  {
    title: 'Equipment',
    className:"column-3",
    children: [
      {
        title: <Tooltip title={`แสดงภาพรวมอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้งอยู่ในพื้นที่ โดยมี Icon สี แสดงจุดที่มีการติดตั้งอุปกรณ์`}>แสดงภาพรวมอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้งอยู่ในพื้นที่...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`การแจ้งเตือนกรณีอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้งอยู่ในพื้นที่หมดอายุการตรวจสภาพโดยมี Icon สี เพื่อแจ้งเตือน`}>การแจ้งเตือนกรณีอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้งอยู่ในพื้นที่หมดอายุการตรวจสภาพโดยมี – ปิด</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`การแจ้งเตือนกรณีอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้ง
        อยู่ในพื้นที่ ใกล้หมดอายุการตรวจสภาพ, หมดอายุการตรวจสภาพ โดยมี Icon สี เพื่อแจ้งเตือนสถานะ`}>การแจ้งเตือนกรณีอุปกรณ์ที่มีความเสี่ยงซึ่งติดตั้ง</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`ภาพรวมการนำอุปกรณ์เข้า - ออก พื้นที่ โดยแสดง
        จำนวนอุปกรณ์เข้า - ออก `}>ภาพรวมการนำอุปกรณ์เข้า - ออก</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงการแจ้งเตือนอุปกรณ์ที่ยังไม่ได้นำออกจากพื้นที่ โดยแจ้งเตือนตามรายการอุปกรณ์ที่มีการขออนุญาตนำเข้าพื้นที่ในแต่ละวัน`}>แสดงการแจ้งเตือนอุปกรณ์ที่ยังไม่ได้นำออกจากพื้นที่...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
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
         align:'center'
      },
    ],
  },
  {
    title: 'Scaffolding',
    className:"column-4",
    children: [
      {
        title: <Tooltip title={`แสดงภาพรวมการติดตั้งนั่งร้าน โดยมี Icon สี แสดงจุดที่มีการติดตั้งนั่งร้าน`}>แสดงภาพรวมการติดตั้งนั่งร้าน...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงการแจ้งเตือนกรณีนั่งร้านที่ติดตั้งในพื้นที่หมดอายุการตรวจสภาพ โดยมี Icon สี เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนกรณีนั่งร้านที่ติดตั้งในพื้นที่หมดอายุการตรวจสภาพ...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`การแจ้งเตือนกรณีนั่งร้านที่ติดตั้งในพื้นที่ใกล้หมดอายุการตรวจสภาพ, หมดอายุการตรวจสภาพ โดยมี Icon สี เพื่อแจ้งเตือนสถานะ`}>กการแจ้งเตือนกรณีนั่งร้านที่ติดตั้งในพื้นที่ใกล้หมดอายุการตรวจสภาพ...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
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
         align:'center'
      },
    ],
  },
  {
    title: 'People Tracking',
    className:"column-5",
    children: [
      {
        title: <Tooltip title={`แสดงภาพรวมบุคคลที่ปฏิบัติงาน โดยมี Icon แสดงแยกตามประเภทกลุ่มบุคคล ได้แก่ ผู้รับเหมา, เจ้าหน้าที่ความปลอดภัย, ผู้เฝ้าระวังไฟ เป็นต้น`}>แสดงภาพรวมบุคคลที่ปฏิบัติงาน...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงการแจ้งเตือนกรณีบุคคลอยู่นิ่ง หรืออยู่นอกพื้นที่การขออนุญาตทำงานมากกว่า 30 นาทีขึ้นไป โดยมี Icon สี เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนกรณีบุคคลอยู่นิ่ง</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงการแจ้งเตือนกรณีบุคคลเกิดเหตุฉุกเฉิน ได้แก่
        ล้ม กดปุ่ม SOS โดยมี Icon สี และสัญญาณเพื่อ
        แจ้งเตือน`}>แสดงการแจ้งเตือนกรณีบุคคลเกิดเหตุฉุกเฉิน</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`การแจ้งเตือนกรณีบุคคลอยู่ในพื้นที่กระบวนการผลิต
        นอกเวลาที่ขออนุญาตทำงาน หรือได้ทำการปิด
        ใบอนุญาตทำงานเสร็จสิ้น โดยมี Icon สี และสัญญาณ
        เพื่อแจ้งเตือน`}>การแจ้งเตือนกรณีบุคคลอยู่ในพื้นที่กระบวนการผลิต...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
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
         align:'center'
      },
    ],
  },
  {
    title: 'Access Control',
    className:"column-6",
    children: [
      {
        title: <Tooltip title={`แสดงภาพรวมบุคคลที่เข้า - ออก พื้นที่ โดย มี Icon แสดงแยกตามประเภทกลุ่มบุคคล และแสดงจำนวนบุคคลเข้า-ออก (ใช้ข้อมูลจากพื้นที่ที่สแกนอุปกรณ์ล่าสุด)`}>แสดงภาพรวมบุคคลที่เข้า-ออก...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงภาพรวมการแลกบัตรเข้า - ออก พื้นที่ แสดงจำนวนบุคคลที่มีการแลกบัตรเข้า - ออก`}>แสดงภาพรวมการแลกบัตรเข้า - ออก</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
      },
      {
        title: <Tooltip title={`แสดงการแจ้งเตือนกรณี อุปกรณ์ Access Control
        Offline โดยมี Pop-up แสดง เพื่อแจ้งเตือน`}>แสดงการแจ้งเตือนกรณี อุปกรณ์ Access Control...</Tooltip>,
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
         align:'center'
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
         align:'center'
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


function SettingUser() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Finish:', values);
  };
  return (
    <div className="container" style={{ marginTop: 12 }}>
      <div className="head">
        <Title >จัดการPermission</Title>
        <Button type='primary' shape='round' onClick={() => navigate('/setting-user')} >จัดการผู้ใช้งาน<ArrowRightOutlined /></Button>
      </div>
      <div className="table-serch">
        <div className='filterSerch' style={{ margin: '12px 0px' }}>
          <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input prefix={<SearchOutlined className="site-form-item-icon" />} placeholder="ค้นหาสิทธิผู้ใช้งาน" />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !form.isFieldsTouched(true) ||
                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  ค้นหา
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
        <Table
          bordered
          className='tablepermission'
          columns={columns}
          dataSource={data}
          rowKey={(i, index) => index}
          scroll={{
            x: 1500,
            y: 300,
          }}
        />
      </div>
    </div>

  )
}

export default SettingUser