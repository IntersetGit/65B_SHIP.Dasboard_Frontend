import { Table, Space, Button, Row, Col, Modal, } from 'antd';
import { isPlainObject } from 'lodash';
import moment from 'moment';
import { useState } from 'react';

const TableData = ({ dataSource }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [datamodal, setDatamodal] = useState(null);

    const columns = [
        {
            title: 'เลข Work',
            dataIndex: 'WorkPermitNo',
            key: 'WorkPermitNo',
            width: 150,
            render: (text, record) => text ? text : "-",
            align: 'center'
        },
        {
            title: 'ชื่อ-สกุล ผู้รับเหมา',
            dataIndex: 'Name',
            key: 'Name',
            render: (text, record) => text ? text : "-",
            width: 200,
        },
        {
            title: 'ผู้อนุญาต / เจ้าของพื้นที่',
            dataIndex: 'OwnerName',
            key: 'OwnerName',
            render: (text, obj) => {
                if (isPlainObject(obj)) {
                    const OwnerName = [];
                    for (const [key, value] of Object.entries(obj)) {
                        if (key.search("OwnerName_") != -1) {
                            OwnerName.push(value)
                        }
                    }
                    return OwnerName.length > 0 ? OwnerName[length - 1] : "-";
                } else {
                    return "-"
                }
            },
            width: 200,
        },
        {
            title: 'ผู้ควบคุมงาน',
            dataIndex: 'PTTStaffCode',
            key: 'PTTStaffCode',
            render: (text, obj) => text ? text : "-",
            width: 100,
            align: 'center'
        },
        {
            title: 'ประเภทอุปกรณ์',
            dataIndex: 'EquipmentType',
            key: 'EquipmentType',
            render: (text, obj) => text ? text : "-",
            width: 150,
            align: 'center'
        },
        {
            title: 'ชื่ออุปกรณ์',
            dataIndex: 'EquipmentName',
            key: 'EquipmentName',
            render: (text, obj) => text ? text : "-",
            width: 200,
        },
        {
            title: 'สถานที่ติดตั้ง',
            dataIndex: 'AreaName',
            key: 'AreaName',
            render: (text, obj) => text ? text : "-",
            width: 150,
            align: 'center'
        },
        {
            title: 'Inspect / not Inspect',
            dataIndex: 'Inspect_Status',
            key: 'Inspect_Status',
            render: (text, obj) => {
                if (text == "0") {
                    return "อุปกรณ์ที่ไม่ Inspect"
                } else if (text == "1") {
                    return "อุปกรณ์ที่ Inspect"
                } else {
                    return "-"
                }
            },
            width: 150,
            align: 'center'
        },
        {
            title: 'วัน-เวลา นำเข้าพื้นที่',
            dataIndex: 'DateTime_In',
            key: 'DateTime_In',
            render: (text, obj) => text ? moment(text).format("DD/MM/YYYY HH:mm:ss") : "-",
            width: 175,
        },
        {
            title: 'เวลา หมดอายุ',
            dataIndex: 'ExpiredDateTime',
            key: 'ExpiredDateTime',
            render: (text, obj) => text ? moment(text).format("DD/MM/YYYY HH:mm:ss") : "-",
            width: 150,
        },
        {
            title: 'วัน หมดอายุ',
            dataIndex: 'ExpiredDateTime',
            key: 'ExpiredDateTime',
            render: (text, obj) => text ? moment(text).format("DD/MM/YYYY HH:mm:ss") : "-",
            width: 150,
        },
        {
            title: 'สถานะแจ้งเตือน',
            dataIndex: 'EquipmentStatus',
            key: 'EquipmentStatus',
            render: (text, obj) => text ? text : "-",
            width: 150,
        },

        {
            title: '...',
            key: '',
            width: 100,
            render: (text, record) => {
                return (
                    <Space size='middle'>
                        <Button
                            type='primary'
                            onClick={() => {
                                const OwnerCode = {}, OwnerName = {};
                                let num_OwnerCode = 1, num_OwnerName = 1;
                                for (const [key, value] of Object.entries(record)) {
                                    if (key.search("OwnerCode_") != -1) {
                                        OwnerCode[`รหัสผู้อนุมัติคนที ${num_OwnerCode}`] = value;
                                        num_OwnerCode++
                                    }
                                    if (key.search("OwnerCode_") != -1) {
                                        OwnerName[`ชื่อผู้อนุมัติคนที่ ${num_OwnerName}`] = value;
                                        num_OwnerName++
                                    }
                                }
                                setDatamodal({
                                    "ชื่อ-สกุล": `${record.Name ?? "-"}`,
                                    "เลขบัตรประชาชน": `${record.PersonalID ?? "-"}`,
                                    "เลข Work Permit": `${record.WorkPermitNo ?? "-"}`,
                                    "รหัสอุปกรณ์": `${record.EquipmentID ?? "-"}`,
                                    "รหัสประเภทอุปกรณ์": `${record.EquipmentTypeCode ?? "-"}`,
                                    "ประเภทอุปกรณ์": `${record.EquipmentType ?? "-"}`,
                                    "ชื่ออุปกรณ์": `${record.EquipmentName ?? "-"}`,
                                    "Inspect / not Inspect": `${(record.Inspect_Status == "0") ? "อุปกรณ์ที่ไม่ Inspect" :
                                        (record.Inspect_Status == "1") ? "อุปกรณ์ที่ Inspect" : "-"
                                        }`,
                                    "Risk Equipment": `${(record.risk_equipment == "0") ? "ไม่เป็นอุปกรณ์เสี่ยง" :
                                        (record.risk_equipment == "1") ? "เป็นอุปกรณ์เสี่ยง" : "-"
                                        }`,
                                    "วัน-เวลา นำอุปกรณ์เข้าพื้นที่": `${record.DateTime_In ? moment(record.DateTime_In).format("DD/MM/YYYY HH:mm:ss") : "-"}`,
                                    "วันที่ หมดอายุ": `${record.ExpiredDateTime ? moment(record.ExpiredDateTime).format("DD/MM/YYYY") : "-"}`,
                                    "เวลา หมดอายุ ": `${record.ExpiredDateTime ? moment(record.ExpiredDateTime).format("HH:mm:ss") : "-"}`,
                                    "รายละเอียดของงาน": `${record.Description ?? "-"}`,
                                    "วัตถุประสงค์": `${record.Objective ?? "-"}`,
                                    "รหัสสถานตืดตั้งอุปกรณ์": `${record.AreaID ?? "-"}`,
                                    "ชื่อสถานที่ติดตั้งอุปกรณ์": `${record.AreaName ?? "-"}`,
                                    "รหัสบริษัท/หน่วยงาน": `${record.CompanyID ?? "-"}`,
                                    "ชื่อบริษัท/หน่วยงาน": `${record.CompanyName ?? "-"}`,
                                    "รหัสผู้ควบคุมงาน": `${record.PTTStaffCode ?? "-"}`,
                                    "ชื่อผู้ควบคุมงาน": `${record.PTTStaffName ?? "-"}`,
                                    "รหัสหน่วยงานผู้ควบคุม": `${record.AgencyCode ?? "-"}`,
                                    "ชื่อหน่วยงานผู้ควบคุม": `${record.AgencyName ?? "-"}`,
                                    ...OwnerCode, 
                                    ...OwnerName,
                                    "รหัสสถานะใบงาน": `${record.StatusID ?? "-"}`,
                                    "สถานะใบงาน": `${record.Status ?? "-"}`,
                                    "สถานะแจ้งเตือน": `${record.EquipmentStatus ?? "-"}`,



                                }), setIsModalVisible(!isModalVisible);
                            }}
                        >
                            Detail
                        </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <>

            <Modal
                title='รายละเอียด'
                okButtonProps={{ hidden: true }}
                onCancel={() => setIsModalVisible(!isModalVisible)}
                visible={isModalVisible}
                bodyStyle={{
                    maxHeight: 600,
                    overflowX: "auto"
                }}
            >
                {datamodal &&
                    Object.entries(datamodal).map(([key, value]) => (
                        !(typeof value == 'object') &&
                        <Row key={key}>
                            <Col span={12}>
                                <span style={{ color: "#0A8FDC" }}>{key}</span>
                            </Col>
                            <Col span={12}>{value ?? "-"}</Col>
                        </Row>
                    ))}
            </Modal>

            <Table
                id='divtable'
                scroll={{ y: '25vh' }}
                size='small'
                style={{ position: 'absolute', bottom: 0, backgroundColor: 'white', display: 'none' }}
                rowClassName={(record, index) =>
                    record?.status_warnning !== null &&
                        record?.status_warnning !== undefined
                        ? 'table-row-red'
                        : ''
                }
                rowKey={(i) => i.id}
                columns={columns}
                dataSource={dataSource}
            />
        </>
    )
}

export default TableData