import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Table,
    Tag,
    Space,
    Form,
    Input,
    InputNumber,
    Button,
    Select,
    Row,
    Col,
    Modal,
    Drawer
} from 'antd';
import { Map, WebScene } from '@esri/react-arcgis';
import { setDefaultOptions, loadModules, loadCss } from 'esri-loader';
import './index.style.less';
import socketClient from '../../../util/socket';
import DaraArea from './dataarea';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../../redux/actions';
import { object } from 'prop-types';
import Demodata from '../../demodata';
import API from '../../../util/Api'
import { isArray } from 'lodash';
import moment from 'moment';

setDefaultOptions({ css: true });

const options = [
    { value: 'gold' },
    { value: 'lime' },
    { value: 'green' },
    { value: 'cyan' },
];
function tagRender(props) {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={value}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
            {label}
        </Tag>
    );
}

const ScaffoldingPage = () => {
    const [stateMap, setStateMap] = useState(null);
    const [stateView, setStateView] = useState(null);
    const refdrawn = useRef();
    const refdetail = useRef();
    const [tabledata, setTabledata] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [datamodal, setDatamodal] = useState(null);
    const dispatch = useDispatch();
    const datademo = new Demodata('scaffolding');

    const columns = [
        {
            title: 'work_number',
            dataIndex: 'work_number',
            key: 'work_number',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'licensor',
            dataIndex: 'licensor',
            key: 'licensor',
        },
        {
            title: 'supervisor',
            dataIndex: 'supervisor',
            key: 'supervisor',
        },
        {
            title: 'workmit_type',
            key: 'workmit_type',
            dataIndex: 'workmit_type',
        },
        {
            title: 'scaffolding_type',
            key: 'scaffolding_type',
            dataIndex: 'scaffolding_type',
        },
        {
            title: 'date_time_start',
            dataIndex: 'date_time_start',
            key: 'date_time_start',
        },
        {
            title: 'date_time_end',
            dataIndex: 'date_time_end',
            key: 'date_time_end',
        },
        {
            title: '',
            key: '',
            render: (text, record) => {
                return (
                    <Space size='middle'>
                        <Button
                            type='primary'
                            onClick={() => {
                                setDatamodal(record), setIsModalVisible(!isModalVisible);
                            }}
                        >
                            Detail
                        </Button>
                    </Space>
                );
            },
        },
    ];

    const columns2 = [
        {
            title: 'เลข work',
            dataIndex: 'WorkPermitNo',
            key: 'WorkPermitNo',
            render: (text) => <a>{text}</a>,
            width: 150
        },
        {
            title: 'ผู้รับเหมา',
            dataIndex: 'VendorName',
            key: 'VendorName',
            width: 250

        },
        {
            title: 'เจ้าของพื้นที่',
            dataIndex: 'OwnerName',
            key: 'OwnerName',
            width: 200
        },
        {
            title: 'ผู้ควบคุมงาน',
            dataIndex: 'PTTStaff',
            key: 'PTTStaff',
            width: 200
        },
        {
            title: 'ประเภทใบอนุญาต',
            key: 'WorkpermitType',
            dataIndex: 'WorkpermitType',
            width: 150
        },
        {
            title: 'สถานที่ติดตั้ง',
            key: 'AreaName',
            dataIndex: 'AreaName',
            width: 150
        },
        {
            title: 'วัน-เวลา เริ่มต้น',
            dataIndex: 'date_time_start',
            key: 'date_time_start',
            width: 200
        },
        {
            title: 'วัน-เวลา สิ้นสุด',
            dataIndex: 'date_time_end',
            key: 'date_time_end',
            width: 200
        },
        {
            title: 'สถานะ work',
            dataIndex: 'WorkPermitStatus',
            key: 'WorkPermitStatus',
            width: 150
        },
        {
            title: 'สถานะแจ้งเตือน',
            dataIndex: 'WarningStatus',
            key: 'WarningStatus',
            width: 150
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
                                setDatamodal(record), setIsModalVisible(!isModalVisible);
                            }}
                        >
                            Detail
                        </Button>
                    </Space>
                );
            },
        },
    ];


    const scaffoldingicon = {
        before_expire: '/assets/iconmap/scaffolding/before-expire.png',
        broken: '/assets/iconmap/scaffolding/broken.png',
        booking: '/assets/iconmap/scaffolding/booking.png',
        expire: '/assets/iconmap/scaffolding/expire.png',
        processing: '/assets/iconmap/scaffolding/processing.png',
    };
    useEffect(() => {
        if (stateMap && stateView) {
            const socketio = new socketClient();
            const socket = socketio.io();
            (async () => {

                const WMSLayer = await loadModules(['esri/layers/WMSLayer']).then(
                    ([WMSLayer]) => WMSLayer,
                );
                const layer = new WMSLayer({
                    url: 'https://pttarcgisserver.pttplc.com/arcgis/services/PTT_LMA/GIS_PatternData/MapServer/WMSServer?request=GetCapabilities&service=WMS',
                });
                layer.load().then(() => {
                    const names = layer.allSublayers
                        .filter((sublayer) => !sublayer.sublayers) // Non-grouping layers will not have any "sublayers".
                        .map((sublayer) => sublayer.name);
                    console.log('Names of all child sublayers', names.join());
                });
                stateMap?.add(layer);
                CreateArea();

                const { Graphic, GraphicsLayer } = await loadModules([
                    'esri/Graphic',
                    'esri/layers/GraphicsLayer',
                ]).then(([Graphic, GraphicsLayer]) => {
                    return { Graphic, GraphicsLayer };
                });

                let layerpoi = new GraphicsLayer({
                    id: 'poi',
                });
                stateMap?.add(layerpoi, 99);


                /* get Data */

                // socket.emit("scaffolding")

                const resSf = await getScaffolding({});
                setMap(resSf)


                socket.on("scaffolding", (res) => {

                    if (res.Status == "success") {
                        setMap(res.Message)
                    }
                });

                async function setMap(item) {
                    const _data = item.data;
                    const _summary = item.summary;

                    // console.log("data =>>>>>>>>>>>>>>>>>", _data);
                    // console.log("summary =>>>>>>>>>>>>>>>>>", _summary);


                    _data.forEach(obj => {

                        obj.date_time_end = moment(new Date(obj.EndDateTime)).format("DD/MM/YYYY hh:mm:ss")
                        obj.date_time_start = moment(new Date(obj.StartDateTime)).format("DD/MM/YYYY hh:mm:ss")
                        obj.id = obj._id
                        obj.latitude = obj.FeaturesPropertiesCentroid_X
                        obj.longitude = obj.FeaturesPropertiesCentroid_Y
                        obj.work_number = obj.WorkName
                        obj.name = obj.WorkName
                        obj.status_warnning = null
                        obj.scaffolding_type = "นั่งร้านแบบเคลื่อนที่ได้"

                    })

                    const data = await datademo.getDemodata();
                    console.log('data', data)
                    console.log('_data', _data)

                    /* Set Dedux */
                    Status_cal(_data);

                    /* Set Table */
                    setTabledata(_data);

                    /* ------------------ set map ------------------ */
                    stateView?.ui?.add(
                        ['divtable', document.querySelector('.ant-table-wrapper')],
                        'bottom-left',
                    );

                    layerpoi.removeAll();
                    _data.map((where) => {
                        const point = {
                            type: 'point', // autocasts as new Point()
                            longitude: where.longitude,
                            latitude: where.latitude,
                        };
                        const imageicon = {
                            type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                            url: scaffoldingicon[`broken`],
                            width: '35px',
                            height: '35px',
                        };
                        const clusterConfig = {
                            type: "cluster",
                            clusterRadius: "20px",
                            popupTemplate: {
                                title: 'Cluster summary',
                                content: 'This cluster represents {cluster_count} earthquakes.',
                                fieldInfos: [
                                    {
                                        fieldName: 'cluster_count',
                                        format: {
                                            places: 0,
                                            digitSeparator: true,
                                        },
                                    },
                                ],
                            },
                            clusterMinSize: "40px",
                            clusterMaxSize: "60px",
                            labelingInfo: [
                                {
                                    deconflictionStrategy: 'none',
                                    labelExpressionInfo: {
                                        expression: "Text($feature.cluster_count, '#,###')",
                                    },
                                    symbol: {
                                        type: 'text',
                                        color: '#004a5d',
                                        font: {
                                            weight: 'bold',
                                            family: 'Noto Sans',
                                            size: '12px',
                                        },
                                    },
                                    labelPlacement: 'center-center',
                                },
                            ],
                        };
                        const pointGraphic = new Graphic({
                            geometry: point,
                            symbol: imageicon,
                            popupTemplate: {
                                title: where.work_number,
                                content: where.name,
                            },
                            featureReduction: clusterConfig,
                            id: 'poi',
                            attributes: {
                                name: 'poi',
                            },
                        });
                        layerpoi.add(pointGraphic);
                    });
                }

            })();
            return () => socket.disconnect();
        }
    }, [stateMap, stateView]);


    const getScaffolding = async (item) => {
        let url = `/scaffolding/all?`;
        if (item.PTTStaffCode) url += `&PTTStaffCode=${item.PTTStaffCode}`;
        if (item.VendorCode) url += `&VendorCode=${item.VendorCode}`;
        if (item.StartDateTime) url += `&StartDateTime=${item.StartDateTime}`;
        if (item.EndDateTime) url += `&EndDateTime=${item.EndDateTime}`;
        if (item.AreaID) url += `&AreaID=${item.AreaID}`;
        if (isArray(item.ScaffoldingType)) {
            item.ScaffoldingType.forEach(e => {
                url += `&ScaffoldingType=${e}`;
            });
        }
        const { data } = await API.get(url);
        return data.Status === 'success' ? data.Message : {
            data: [],
            summary: {
                all: 0,
                expire: 0,
                near_expire: 0,
            }
        }
    }



    loadModules([
        'esri/config',
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/TileLayer',
    ]).then(async ([esriConfig, Map, MapView, TileLayer]) => {
        esriConfig.apiKey =
            'AAPKf24959e55476492eb12c8cbaa4d1261etdgkaLK718fs8_EuvckemKt2gyRR-8p04PR7mC2G8Oi5oNli_65xV-C8u8BuPQTZ';

        // var map = new Map({
        //   basemap: "streets"
        // });

        // var view = new MapView({
        //   container: "viewDiv",  // Reference to the DOM node that will contain the view
        //   map: map               // References the map object created in step 3
        // });

        // const Fullscreen = await loadModules(["esri/widgets/Fullscreen"]).then(([Fullscreen]) => Fullscreen);
        // const full = new Fullscreen({
        //   view: view
        // });
        // console.log('full :>> ', full);
        // view.ui.add(full, "top-left");
    });

    const CreateArea = async () => {
        const { Graphic, GraphicsLayer, Polygon } = await loadModules([
            'esri/Graphic',
            'esri/layers/GraphicsLayer',
            'esri/geometry/Polygon',
        ]).then(([Graphic, GraphicsLayer, Polygon]) => {
            return { Graphic, GraphicsLayer, Polygon };
        });
        for (const layer in DaraArea) {
            // DaraArea.map( async(layer) => {
            let layerArea = new GraphicsLayer({
                id: DaraArea[layer].name,
            });
            stateMap?.add(layerArea, 0);

            const polygon = new Polygon({
                rings: DaraArea[layer].geomantry,
            });

            // Create a symbol for rendering the graphic
            const fillSymbol = {
                type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                color: DaraArea[layer].color,
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 1,
                },
            };

            // Add the geometry and symbol to a new graphic
            const polygonGraphic = new Graphic({
                geometry: polygon,
                symbol: fillSymbol,
            });
            // stateView?.graphics?.addMany([polygonGraphic]);
            await layerArea.add(polygonGraphic);

            await stateView?.goTo(polygon.extent);

            // })
        }
    };

    const Status_cal = async (data) => {
        let warning = data.filter((data, key) => data.status_warnning !== null);
        const sum = data.map((data, key) => data.scaffolding_type);
        let result = [...new Set(sum)].reduce(
            (acc, curr) => ((acc[curr] = sum.filter((a) => a == curr).length), acc),
            {},
        );
        // console.log('result :>> ', result);
        dispatch(
            setStatus({ ...result, warning: warning.length, total: sum.length }),
        );
    };

    const Onload = async (map, view) => {
        const { Fullscreen, UI, Zoom, Expand } = await loadModules([
            'esri/widgets/Fullscreen',
            'esri/views/ui/UI',
            'esri/widgets/Zoom',
            'esri/widgets/Expand',
        ]).then(([Fullscreen, UI, Zoom, Expand]) => {
            return { Fullscreen, UI, Zoom, Expand };
        });
        const fullscreenui = new Fullscreen({
            view: view,
        });
        const zoomui = new Zoom({
            view: view,
        });
        const expand = new Expand({
            expandTooltip: 'ค้นหา',
            view: view,
            autoCollapse: false,
            // collapseIconClass:'esri-icon-search',
            expandIconClass: 'esri-icon-search',
            content: refdrawn.current,
        });
        const detaillayer = new Expand({
            view: view,
            content: refdetail.current,
            expandIconClass: 'esri-icon-notice-round',
        });
        view.ui.add('button-top', 'top-left');

        view.ui.add(expand, 'top-right');
        view.ui.add(fullscreenui, 'top-right');
        view.ui.add(zoomui, 'top-right');
        view.ui.add(detaillayer, 'top-right');
        view?.ui?.add(
            ['divtable', document.querySelector('.ant-table-wrapper')],
            'bottom-left',
        );

        setStateMap(map);
        setStateView(view);
    };

    const onFinish = async (value) => {
        try {
            console.log('value', value)
        } catch (error) {
            console.log('error', error)
        }
    }

    const onFinishFailed = (error) => {
        console.log('error', error)
    }

    const [visible, setVisible] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Map
                className='Mapacrgis'
                onLoad={Onload}
                mapProperties={{
                    basemap: /*`${'arcgis-light-gray'?? 'arcgis-navigation'}`*/ {
                        portalItem: {
                            id: '8d91bd39e873417ea21673e0fee87604', // nova basemap
                        },
                    },
                    autoResize: false,
                }}
                viewProperties={{
                    center: [100.3330867, 14.5548052],
                    ui: { components: ['attribution', 'compass'] },
                }}
            >
                <div id='button-top' className='button-topleft'>
                    <div
                        className='esri-widget--button esri-icon-table'
                        onClick={() => {
                            // if (
                            //     document.querySelector('.esri-ui-bottom-left').style.display ===
                            //     'none' ||
                            //     document.querySelector('.esri-ui-bottom-left').style.display ===
                            //     ''
                            // ) {
                            //     document
                            //         .querySelector('.esri-ui-bottom-left')
                            //         .style.setProperty('display', 'block', 'important');
                            //     document
                            //         .querySelector('.esri-ui-bottom-left')
                            //         .style.setProperty('min-width', '98vw', 'important');
                            // } else {
                            //     document
                            //         .querySelector('.esri-ui-bottom-left')
                            //         .style.setProperty('display', 'none', 'important');
                            // }

                            setVisible(true)
                        }}
                    />
                </div>
                <div
                    ref={refdrawn}
                    id='viewtest'
                    className='menuserchslide esri-widget'
                >
                    <Form
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 16 }}
                        name='nest-messages'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name={['user', 'name']}
                            label='วันเวลา เริ้มต้น'
                            rules={[{ required: true }]}
                        >
                            <Input size='small' />
                        </Form.Item>
                        <Form.Item
                            name={['user', 'email']}
                            label='วันเวลา สิ้นสุด'
                            rules={[{ type: 'email' }]}
                        >
                            <Input size='small' />
                        </Form.Item>
                        <Form.Item
                            name={['user', 'age']}
                            label='สถานที่ปฎิบัติงาน'
                            rules={[{ type: 'number', min: 0, max: 99 }]}
                        >
                            <InputNumber size='small' />
                        </Form.Item>
                        <Form.Item name={['user', 'website']} label='ประเภทใบอนุญาติ'>
                            <Input size='small' />
                        </Form.Item>
                        <Form.Item name={['user', 'website']} label='หัวข้อการค้นหา'>
                            <Select
                                mode='multiple'
                                showArrow
                                tagRender={tagRender}
                                style={{ width: '100%' }}
                                options={options}
                            />
                        </Form.Item>
                        <Form.Item name={['user', 'introduction']} label='Introduction'>
                            <Input.TextArea size='ข้อเสนอแนะ' />
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 16, offset: 18 }}>
                            <Button type='primary' htmlType='submit'>
                                ค้นหา
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div ref={refdetail} className='menuserchslide detailemo esri-widget'>
                    <Row>
                        <Col span={8}>
                            <p>ใช้ 8 สีแทนประเภท</p>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gridGap: '5px',
                                }}
                            >
                                <span>🔴</span>
                                <span>🟠</span>
                                <span>🟡</span>
                                <span>🟢</span>
                                <span>🔵</span>
                            </div>
                        </Col>
                        <Col span={8}>
                            <p>ใช้ 2 สีแทนประเภท</p>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gridGap: '5px',
                                }}
                            >
                                <span>🟢</span>
                                <span>🔵</span>
                            </div>
                        </Col>
                        <Col span={8}>
                            <p>ใช้สัญลักษณ์แทนการแจ้งเตือน</p>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gridGap: '5px',
                                }}
                            >
                                <span>🚸</span>
                                <span>⛔</span>
                                <span>✅</span>
                                <span>🛑</span>
                                <span>🚯</span>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Table
                    id='divtable'
                    scroll={{ y: '25vh', x: "100%" }}
                    size='small'
                    rowClassName={(record, index) =>
                        record?.status_warnning !== null &&
                            record?.status_warnning !== undefined
                            ? 'table-row-red'
                            : ''
                    }
                    rowKey={(i) => i.id}
                    columns={columns}
                    dataSource={tabledata}
                />
            </Map>

            {/* <div id="viewDiv" style={{height:'70vh'}}></div> */}

            <Modal
                title='รายละเอียด'
                okButtonProps={{ hidden: true }}
                onCancel={() => setIsModalVisible(!isModalVisible)}
                visible={isModalVisible}
                bodyStyle={{
                    maxHeight: "60vh",
                    overflowX: "auto"
                }}
            >
                {datamodal &&
                    Object.entries(datamodal).map(([key, value]) => (
                        <Row key={key}>
                            <Col span={12}>
                                <a>{key}</a>
                            </Col>
                            <Col span={12}>{value}</Col>
                        </Row>
                    ))}
            </Modal>

            <Drawer
                id='divtable'
                title={false}
                placement={"bottom"}
                // closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
            >
                <Table size='small' dataSource={tabledata} columns={columns2} rowKey={(row) => row.id} scroll={{ x: "100%", y: "30vh" }} />
            </Drawer>
        </div>
    );
};

export default ScaffoldingPage;
