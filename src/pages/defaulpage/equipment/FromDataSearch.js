import { Form, Button, Select , Divider } from 'antd';
import { isPlainObject, isArray } from 'lodash';
import { useState, useEffect } from 'react';

const FromDataSearch = ({ form, onFinish, onFinishFailed, filter, reset }) => {

    const [EquipmentTypeOptions, setEquipmentTypeOptions] = useState([]);
    const [AgencyNameOptions, setAgencyNameOptions] = useState([]);
    const [AreaNameOptions, setAreaNameOptions] = useState([]);
    const [PTTStaffCodeOptions, setPTTStaffCodeOptions] = useState([]);

    useEffect(() => {
        if (isPlainObject(filter)) {

            console.log('filter =>>>>>>>', filter)
            if (isArray(filter.EquipmentType)) setEquipmentTypeOptions(filter.EquipmentType.map(e => { return { value: e.EquipmentType } }))
            if (isArray(filter.AgencyName)) setAgencyNameOptions(filter.AgencyName.map(e => { return { value: e.AgencyName } }))
            if (isArray(filter.PTTStaffCode)) setPTTStaffCodeOptions(filter.PTTStaffCode.map(e => { return { value: e.PTTStaffCode } }))
            if (isArray(filter.AreaName)) setAreaNameOptions(filter.AreaName.map(e => { return { value: e.AreaName } }))
        }
    }, [filter])


    return (
        <>

            <Form
                form={form}
                // labelCol={{ span: 10 }}
                // wrapperCol={{ span: 16 }}
                name='nest-messages'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
            >
                <Form.Item
                    name="PTTStaffCode"
                    // label='รหัสพนักงานผู้ควบคุมงาน'
                    label={<Divider orientation="left">รหัสพนักงานผู้ควบคุมงาน</Divider>}
                >
                    <Select
                        showArrow
                        style={{ width: '100%' }}
                        options={PTTStaffCodeOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="AgencyName"
                    // label='หน่วยงานผู้ควบคุมงาน'
                    label={<Divider orientation="left">หน่วยงานผู้ควบคุมงาน</Divider>}
                >
                    <Select
                        showArrow
                        style={{ width: '100%' }}
                        options={AgencyNameOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="AreaName"
                    // label='สถานที่ติดตั้งอุปกรณ์'
                    label={<Divider orientation="left">สถานที่ติดตั้งอุปกรณ์</Divider>}
                >
                    <Select
                        showArrow
                        style={{ width: '100%' }}
                        options={AreaNameOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="EquipmentType"
                    // label='ประเภทอุปกรณ์'
                    label={<Divider orientation="left">ประเภทอุปกรณ์</Divider>}
                >
                    <Select
                        mode='multiple'
                        showArrow
                        style={{ width: '100%' }}
                        options={EquipmentTypeOptions}
                    />
                </Form.Item>

                <div className='text-center pt-3'>
                    <Button type='primary' htmlType='submit' style={{ width: 100 }}>
                        ค้นหา
                    </Button>
                    <span style={{ paddingRight: 5 }} />
                    <Button style={{ width: 100 }} onClick={reset}>
                        ค่าเริ่มต้น
                    </Button>
                </div>
            </Form>

        </>
    )
}

export default FromDataSearch