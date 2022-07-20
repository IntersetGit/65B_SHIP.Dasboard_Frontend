import React, { useState, useEffect } from 'react'
import PTTlayers from '../../util/PTTlayer'
import { Button, Form, Divider, Select, Space } from 'antd';
import './index.style.less';
import { loadModules } from 'esri-loader';
import { polygon, point } from '@turf/turf';

import {
    SearchOutlined,
    RetweetOutlined
} from '@ant-design/icons';

const { Option } = Select;

const Searchlayer = React.forwardRef(({ map, view, on_serch_plant, on_serch_area, on_serch_building, on_serch_equipment, on_refresh_all }, ref) => {
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

                let getarea = selectArea?.find((i) => i.LAYERNAME == type);
                let getvalue = getarea?.RESULT.find((item) => item[id] == PLANT);
                // console.log('getvalue', getvalue)
                PLANT && on_serch_plant && on_serch_plant(getvalue);
                serch_plant(getvalue)
                break;
            }
            case 'AREA': {
                let getarea = selectArea?.find((i) => i.LAYERNAME == type);
                let getvalue = getarea?.RESULT.find((item) => item[id] == AREA);
                // console.log('getvalue', getvalue)
                AREA && on_serch_area && on_serch_area(getvalue);
                serch_area(getvalue)

                break;
            }
            case 'BUILDING': {
                let getarea = selectArea?.find((i) => i.LAYERNAME == type);
                let getvalue = getarea?.RESULT.find((item) => item[id] == BUILDING);
                console.log('getvalue', getvalue)
                BUILDING && on_serch_building && on_serch_building(getvalue);
                serch_building(getvalue)

                break;
            }
            case 'EQUIPMENT': {
                let getarea = selectArea?.find((i) => i.LAYERNAME == type);
                let getvalue = getarea?.RESULT.find((item) => item[id] == EQUIPMENT);
                console.log('getvalue', getvalue)
                EQUIPMENT && on_serch_equipment && on_serch_equipment(getvalue);
                serch_equipment(getvalue)

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


    const serch_plant = async (area) => {
        const [GeoJSONLayer] = await loadModules([
            'esri/layers/GeoJSONLayer'
        ]);
        var polygons = polygon(area.SHAPE.GEOMETRY, area);
        const blob = new Blob([JSON.stringify(polygons)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const uniqueValuesByColorProperty = {
            type: "unique-value",
            field: "color",
            defaultSymbol: {
                type: "simple-fill",
                color: [0, 255, 222, 0.3],
                outline: {
                    color: [0, 255, 222],
                    width: 1
                },
                width: 1,
                style: "solid"
            },
            defaultLabel: "Other polygons", //  used in the Legend widget for types not specified
        };
        const geojsonlayer = new GeoJSONLayer({
            id: 'PLANT',
            url: url,
            copyright: "PTT",
            renderer: uniqueValuesByColorProperty,
            popupTemplate: {
                title: "{UNITNAME}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "OBJECTID"
                            },
                            {
                                fieldName: "UNITID"
                            },
                            {
                                fieldName: "SUBUNITNAME"
                            },
                            {
                                fieldName: "UNITNAME"
                            }
                        ]
                    }
                ]
            }
        });
        geojsonlayer.when(() => {
            return geojsonlayer.queryExtent();
          })
          .then((response) => {
            view?.goTo(response.extent);
          });
        map?.remove(map?.findLayerById('PLANT'));
        map?.add(geojsonlayer);
    }
    const serch_area = async (area) => {
        const [GeoJSONLayer] = await loadModules([
            'esri/layers/GeoJSONLayer'
        ]);
        var polygons = polygon(area.SHAPE.GEOMETRY, area);
        const blob = new Blob([JSON.stringify(polygons)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const uniqueValuesByColorProperty = {
            type: "unique-value",
            field: "color",
            defaultSymbol: {
                type: "simple-fill",
                color: [0, 255, 0, 0.3],
                outline: {
                    color: [0, 255, 0],
                    width: 1
                },
                width: 1,
                style: "solid"
            },
            defaultLabel: "Other polygons", //  used in the Legend widget for types not specified
        };
        const geojsonlayer = new GeoJSONLayer({
            id: 'AREA',
            url: url,
            copyright: "PTT",
            renderer: uniqueValuesByColorProperty,
            popupTemplate: {
                title: "{UNITNAME}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "OBJECTID"
                            },
                            {
                                fieldName: "UNITID"
                            },
                            {
                                fieldName: "SUBUNITNAME"
                            },
                            {
                                fieldName: "UNITNAME"
                            }
                        ]
                    }
                ]
            }
        });
        geojsonlayer.when(() => {
            return geojsonlayer.queryExtent();
          })
          .then((response) => {
            view?.goTo(response.extent);
          });
        map?.remove(map?.findLayerById('AREA'));
        map?.add(geojsonlayer);
    }
    const serch_building = async (area) => {
        const [GeoJSONLayer] = await loadModules([
            'esri/layers/GeoJSONLayer'
        ]);
        var polygons = polygon(area.SHAPE.GEOMETRY, area);
        const blob = new Blob([JSON.stringify(polygons)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const uniqueValuesByColorProperty = {
            type: "unique-value",
            field: "color",
            defaultSymbol: {
                type: "simple-fill",
                color: [255, 167, 33, 0.3],
                outline: {
                    color: [255, 167, 33],
                    width: 1
                },
                width: 1,
                style: "solid"
            },
            defaultLabel: "Other polygons", //  used in the Legend widget for types not specified
        };
        const geojsonlayer = new GeoJSONLayer({
            id: 'BUILDING',
            url: url,
            copyright: "PTT",
            renderer: uniqueValuesByColorProperty,
            popupTemplate: {
                title: "{UNITNAME}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "OBJECTID"
                            },
                            {
                                fieldName: "UNITID"
                            },
                            {
                                fieldName: "SUBUNITNAME"
                            },
                            {
                                fieldName: "UNITNAME"
                            }
                        ]
                    }
                ]
            }
        });
        geojsonlayer.when(() => {
            return geojsonlayer.queryExtent();
          })
          .then((response) => {
            view?.goTo(response.extent);
          });
        map?.remove(map?.findLayerById('BUILDING'));
        map?.add(geojsonlayer);
    }
    const serch_equipment = async (area) => {
        const [GeoJSONLayer] = await loadModules([
            'esri/layers/GeoJSONLayer'
        ]);
        var points = point(area.SHAPE.GEOMETRY, area);
        const blob = new Blob([JSON.stringify(points)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const uniqueValuesByColorProperty = {
            type: "unique-value",
            field: "color",
            defaultSymbol: {
                type: 'simple-marker',
                style:'triangle',
                size: 15,
                color: [255, 0, 0],
                outline: {
                    color: '#FFF',
                    width: 1,
                },
            },
            defaultLabel: "Other polygons", //  used in the Legend widget for types not specified
        };
        const geojsonlayer = new GeoJSONLayer({
            id: 'EQUIPMENT',
            url: url,
            copyright: "PTT",
            renderer: uniqueValuesByColorProperty,
            popupTemplate: {
                title: "{UNITNAME}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "OBJECTID"
                            },
                            {
                                fieldName: "UNITID"
                            },
                            {
                                fieldName: "SUBUNITNAME"
                            },
                            {
                                fieldName: "UNITNAME"
                            }
                        ]
                    }
                ]
            }
        });
        geojsonlayer.when(() => {
            return geojsonlayer.queryExtent();
          })
          .then((response) => {
            // console.log('response :>> ', response);
            view?.goTo(response.extent.center);
          });
        map?.remove(map?.findLayerById('EQUIPMENT'));
        map?.add(geojsonlayer);
    }
    const refresh_all = () => {
        // on_refresh_all();
        setPLANT(undefined);
        setAREA(undefined);
        setBUILDING(undefined);
        setEQUIPMENT(undefined);
        map?.removeMany([map?.findLayerById('PLANT'), map?.findLayerById('AREA'), map?.findLayerById('BUILDING'), map?.findLayerById('EQUIPMENT')])


    }
    return (
        <div ref={ref} id="infoDiv" style={{ width: '200px', height: '100%', padding: "10px" }} className="esri-widget">
            สถานที่ใช้งาน
            <Button onClick={refresh_all} id='bt-refresh' style={{ float: 'right' }} size="small" icon={<RetweetOutlined />}></Button>
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
                    value={PLANT}
                >
                    {OptionSelectArea("PLANT")}
                </Select>
                <Button className='btn-plant' onClick={() => onClick('PLANT')} size="small" icon={<SearchOutlined />}></Button>
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
                    value={AREA}
                >
                    {OptionSelectArea("AREA")}
                </Select>
                <Button className='btn-area' onClick={() => onClick('AREA')} size="small" icon={<SearchOutlined />}></Button>
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
                    value={BUILDING}
                >
                    {OptionSelectArea("BUILDING")}
                </Select>
                <Button className='btn-building' onClick={() => onClick('BUILDING')} size="small" icon={<SearchOutlined />}></Button>
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
                    value={EQUIPMENT}
                >
                    {OptionSelectArea("EQUIPMENT")}
                </Select>
                <Button className='btn-equipment' onClick={() => onClick('EQUIPMENT')} size="small" icon={<SearchOutlined />}></Button>
            </Space>
        </div>
    )
})

export default Searchlayer;