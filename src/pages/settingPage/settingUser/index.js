import React from 'react'
import { Table, Button, Form, Input, Typography, Tooltip, Checkbox } from 'antd';
import { SearchOutlined, EyeInvisibleOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './index.style.less';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;


const columns = [
  {
    title: 'รหัส',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: 100
  },
  {
    title: 'ชื่อ-สกุล',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'เลขบัตรประชาชน',
    dataIndex: 'ip',
    key: '2',
    align: 'center',
  },
  {
    title: 'หน่วยงาน',
    dataIndex: 'agency',
    key: '3',
    align: 'center',
  },
  {
    title: 'สิทธิ์ผู้ใช้งานระบบ',
    dataIndex: 'role',
    key: '4',
    align: 'center',
  },

  {
    title: 'จัดการ',
    key: 'operation',
    align: 'center',
    fixed: 'right',
    width: 150,
    render: () => <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <Tooltip title="ดู">
        <Button type="primary" shape="circle" icon={<SearchOutlined />} />
      </Tooltip>
      <Tooltip title="แก้ไข">
        <Button type="primary" style={{ backgroundColor: '#F99', border: 'none' }} shape="circle" icon={<EditOutlined />} />
      </Tooltip>
      <Tooltip title="บล็อคผู้ใช้">
        <Button danger type="primary" shape="circle" icon={<EyeInvisibleOutlined />} />
      </Tooltip>
    </div>,
  },
];
const data = [];

for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    id: Math.floor(Math.random() * 100),
    name: `Edrward ${i}`,
    ip: Date.now(),
    agency: 'PTT',
    role: 'ผู้ดูแลระบบ',
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
        <Title >จัดการผู้ใช้งาน</Title>
        <Button type='primary' shape='round' onClick={() => navigate('/setting-permission')} >จัดการ Permission <ArrowRightOutlined /></Button>
      </div>
      <div className="table-serch">
        <div className='filterSerch' style={{ margin: '12px 0px' }}>
          <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input prefix={<SearchOutlined className="site-form-item-icon" />} placeholder="ค้นหาชื่อผู้ใช้" />
            </Form.Item>
            <Form.Item
              name="row"
              rules={[{ required: true, message: 'Please input your row!' }]}
            >
              <Input
                type="text"
                placeholder="ค้นหาสิทผู้ใช้งาน"
              />
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
          className='table-user'
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