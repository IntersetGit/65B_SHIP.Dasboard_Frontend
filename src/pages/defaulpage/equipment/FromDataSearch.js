import { Form, Button, Select } from 'antd';
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
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 16 }}
                name='nest-messages'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="PTTStaffCode"
                    label='รหัสพนักงานผู้ควบคุมงาน'
                >
                    <Select
                        showArrow
                        style={{ width: '100%' }}
                        options={PTTStaffCodeOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="AgencyName"
                    label='หน่วยงานผู้ควบคุมงาน'
                >
                    <Select
                        showArrow
                        style={{ width: '100%' }}
                        options={AgencyNameOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="AreaName"
                    label='สถานที่ติดตั้งอุปกรณ์'
                >
                    <Select
                        showArrow
                        style={{ width: '100%' }}
                        options={AreaNameOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="EquipmentType"
                    label='ประเภทอุปกรณ์'
                >
                    <Select
                        mode='multiple'
                        showArrow
                        style={{ width: '100%' }}
                        options={EquipmentTypeOptions}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24, offset: 5 }} style={{ textAlign: "end" }}>
                    <Button type='primary' htmlType='submit' style={{ width: 100 }}>
                        ค้นหา
                    </Button>
                    <span style={{ paddingRight: 5 }} />
                    <Button style={{ width: 100 }} onClick={reset}>
                        ค่าเริ่มต้น
                    </Button>
                </Form.Item>
            </Form>

        </>
    )
}

export default FromDataSearch