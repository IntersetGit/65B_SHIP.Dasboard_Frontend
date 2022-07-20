import React, { useState, useEffect } from 'react'
import PTTlayers from '../../util/PTTlayer'
import { Button, Form, Divider, Select, Space } from 'antd';
import './index.style.less';

import {
    SearchOutlined,
    RetweetOutlined
} from '@ant-design/icons';

const { Option } = Select;

const Searchlayer = React.forwardRef(({ on_serch_plant, on_serch_area, on_serch_building, on_serch_equipment }, ref) => {
    const PTTlayer = new PTTlayers();
    const [selectArea, setselectArea] = useState([]);
    const [PLANT, setPLANT] = useState(undefined);
    const [AREA, setAREA] = useState(undefined);
    const [BUILDING, setBUILDING] = useState(undefined);
    const [EQUIPMENT, setEQUIPMENT] = useState(undefined);
    useEffect(() => {
        (async () => {
            let area = await PTTlayer.GETMASTER_AREA_LAYERGIS();
            setselectArea(area);

        })();
    }, []);

    const onClick = (type) => {
        let id = type == "PLANT" ? ["OBJECTID"] : type == "AREA" ? ["SUBUNITID"] : type == "BUILDING" ? ["BLDGID"] : type == "EQUIPMENT" ? ["EQUIPMENTID"] : ["OBJECTID"];
        switch (type) {
            case 'PLANT': {
                PLANT && on_serch_plant && on_serch_plant(PLANT);
                let getarea = selectArea?.find((i) => i.LAYERNAME == type);
                let getvalue = getarea?.RESULT.find((item) => item[id] == PLANT);
                console.log('getvalue', getvalue)
                break;
            }
            case 'AREA': {
                AREA && on_serch_area && on_serch_area(AREA);
                let getarea = selectArea?.find((i) => i.LAYERNAME == type);
                let getvalue = getarea?.RESULT.find((item) => item[id] == AREA);
                console.log('getvalue', getvalue)
                break;
            }
            case 'BUILDING': {
                BUILDING && on_serch_building && on_serch_building(BUILDING);
                let getarea = selectArea?.find((i) => i.LAYERNAME == type);
                let getvalue = getarea?.RESULT.find((item) => item[id] == BUILDING);
                console.log('getvalue', getvalue)
                break;
            }
            case 'EQUIPMENT': {
                EQUIPMENT && on_serch_equipment && on_serch_equipment(EQUIPMENT);
                let getarea = selectArea?.find((i) => i.LAYERNAME == type);
                let getvalue = getarea?.RESULT.find((item) => item[id] == EQUIPMENT);
                console.log('getvalue', getvalue)
                break;
            }
            default:
                break;
        }
    };

    const OptionSelectArea = (namearea) => {
        // console.log('selectArea', selectArea)
        if (selectArea.length > 0) {
            let area = selectArea?.find((i) => i.LAYERNAME == namearea);
            if (area) {
                let id = namearea == "PLANT" ? ["OBJECTID"] : namearea == "AREA" ? ["SUBUNITID"] : namearea == "BUILDING" ? ["BLDGID"] : namearea == "EQUIPMENT" ? ["EQUIPMENTID"] : ["OBJECTID"];
                let label = namearea == "PLANT" ? ["UNITNAME"] : namearea == "AREA" ? ["SUBUNITNAME"] : namearea == "BUILDING" ? ["BLDGNAME"] : namearea == "EQUIPMENT" ? ["EQUIPMENTID"] : ["OBJECTID"];
                return (
                    <>
                        {area?.RESULT?.map((item, index) =>
                            <Option key={index} value={item[id]}>{item[label]}</Option>
                        )}
                    </>
                )
            }
        }
    }

    return (
        <div ref={ref} id="infoDiv" style={{ width: '200px', height: '100%', padding: "10px" }} className="esri-widget">
            สถานที่ใช้งาน
            <Button id='bt-refresh' style={{float:'right'}} size="small" icon={<RetweetOutlined />}></Button>
            <Divider orientation="left">Plant</Divider>
            <Space style={{ margin: "5px 0px" }}>
                <Select
                    loading={selectArea.length > 0 ? false : true}
                    showSearch
                    allowClear
                    placeholder="ค้นหา"
                    optionFilterProp="children"
                    size="small"
                    style={{ width: '150px' }}
                    onChange={(e) => setPLANT(e)}
                >
                    {OptionSelectArea("PLANT")}
                </Select>
                <Button onClick={() => onClick('PLANT')} size="small" icon={<SearchOutlined />}></Button>
            </Space>
            <Divider orientation="left">Area</Divider>
            <Space style={{ margin: "5px 0px" }}>
                <Select
                    loading={selectArea.length > 0 ? false : true}
                    showSearch
                    allowClear
                    placeholder="ค้นหา"
                    optionFilterProp="children"
                    size="small"
                    style={{ width: '150px' }}
                    onChange={(e) => setAREA(e)}
                >
                    {OptionSelectArea("AREA")}
                </Select>
                <Button onClick={() => onClick('AREA')} size="small" icon={<SearchOutlined />}></Button>
            </Space>
            <Divider orientation="left">Building</Divider>
            <Space style={{ margin: "5px 0px" }}>
                <Select
                    loading={selectArea.length > 0 ? false : true}
                    showSearch
                    allowClear
                    placeholder="ค้นหา"
                    optionFilterProp="children"
                    size="small"
                    style={{ width: '150px' }}
                    onChange={(e) => setBUILDING(e)}
                >
                    {OptionSelectArea("BUILDING")}
                </Select>
                <Button onClick={() => onClick('BUILDING')} size="small" icon={<SearchOutlined />}></Button>
            </Space>
            <Divider orientation="left">Equipment</Divider>
            <Space style={{ margin: "5px 0px" }}>
                <Select
                    loading={selectArea.length > 0 ? false : true}
                    showSearch
                    allowClear
                    placeholder="ค้นหา"
                    optionFilterProp="children"
                    size="small"
                    style={{ width: '150px' }}
                    onChange={(e) => setEQUIPMENT(e)}
                >
                    {OptionSelectArea("EQUIPMENT")}
                </Select>
                <Button onClick={() => onClick('EQUIPMENT')} size="small" icon={<SearchOutlined />}></Button>
            </Space>
        </div>
    )
})

export default Searchlayer;