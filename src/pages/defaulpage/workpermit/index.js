import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table, Tag, Space, Form, Input, InputNumber, Button, Select, Row, Col, Modal } from 'antd';
import { Map, WebScene, } from '@esri/react-arcgis';
import { setDefaultOptions, loadModules, loadCss } from 'esri-loader';
import './index.style.less';
import io from 'socket.io-client';
import DaraArea from './dataarea';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../../redux/actions'
import { object } from 'prop-types';

setDefaultOptions({ css: true });
const socket = io.connect('http://localhost:3001');

const options = [{ value: 'gold' }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];
function tagRender(props) {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = event => {
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



const Page1 = () => {
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);
  const refdrawn = useRef();
  const refdetail = useRef();
  const [tabledata, setTabledata] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [datamodal, setDatamodal] = useState(null);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'fullName',
      dataIndex: 'fullName',
      key: 'fullName',
      render: text => <a>{text}</a>,
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'state',
      key: 'state',
      dataIndex: 'state',
      render: tags => (
        <>
          <Tag color={'blue'} key={tags}>
            {tags.toUpperCase()}
          </Tag>
        </>
      ),
    },
    {
      title: '',
      key: '',
      render: (text, record) => {
        return (
          <Space size="middle">
            <Button type='primary' onClick={() => { setDatamodal(record), setIsModalVisible(!isModalVisible) }}>Show</Button>
          </Space>
        )
      },
    },
  ];

  useEffect(() => {
    (async () => {

      const WFSLayer = await loadModules(["esri/layers/WFSLayer"]).then(([WFSLayer]) => WFSLayer);
      const layer2 = new WFSLayer({
        url: "https://pttarcgisserver.pttplc.com/arcgis/services/PTT_LMA/GIS_PatternData/MapServer/WFSServer?request=GetCapabilities&service=WFS",

      });
      const WMSLayer = await loadModules(["esri/layers/WMSLayer"]).then(([WMSLayer]) => WMSLayer);
      const layer = new WMSLayer({
        url: "https://pttarcgisserver.pttplc.com/arcgis/services/PTT_LMA/GIS_PatternData/MapServer/WMSServer?request=GetCapabilities&service=WMS",

      });
      layer.load().then(() => {
        const names = layer.allSublayers
          .filter((sublayer) => !sublayer.sublayers) // Non-grouping layers will not have any "sublayers".
          .map((sublayer) => sublayer.name);
        console.log("Names of all child sublayers", names.join());
      });
      stateMap?.add(layer)
      CreateArea()



    })();
  }, [stateMap, stateView,]);


  loadModules(["esri/config", "esri/Map", 'esri/views/MapView', "esri/layers/TileLayer"])
    .then(async ([esriConfig, Map, MapView, TileLayer]) => {
      esriConfig.apiKey = "AAPKf24959e55476492eb12c8cbaa4d1261etdgkaLK718fs8_EuvckemKt2gyRR-8p04PR7mC2G8Oi5oNli_65xV-C8u8BuPQTZ";

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
    const { Graphic, GraphicsLayer, Polygon } = await loadModules(["esri/Graphic", "esri/layers/GraphicsLayer", "esri/geometry/Polygon"]).then(([Graphic, GraphicsLayer, Polygon]) => { return { Graphic, GraphicsLayer, Polygon } });
    for (const layer in DaraArea) {
      // DaraArea.map( async(layer) => {
      let layerArea = new GraphicsLayer({
        id: DaraArea[layer].name
      });
      stateMap?.add(layerArea, 0);

      const polygon = new Polygon({
        rings: DaraArea[layer].geomantry
      });

      // Create a symbol for rendering the graphic
      const fillSymbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: DaraArea[layer].color,
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      };

      // Add the geometry and symbol to a new graphic
      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol
      });
      // stateView?.graphics?.addMany([polygonGraphic]);
      await layerArea.add(polygonGraphic);

      await stateView?.goTo(polygon.extent)

      // })
    }

  }

  const Status_cal = async (data) => {
    const sum = data.map((data, key) => data.type );
    let result = [...new Set(sum)].reduce((acc,curr)=> (acc[curr]=(sum.filter(a=>a==curr)).length,acc),{});
    // console.log('result :>> ', result);
    dispatch(setStatus(result));
  }

  const Onload = async (map, view) => {
    const { Fullscreen, UI, Zoom, Expand } = await loadModules(["esri/widgets/Fullscreen", "esri/views/ui/UI", "esri/widgets/Zoom", "esri/widgets/Expand",]).then(([Fullscreen, UI, Zoom, Expand]) => { return { Fullscreen, UI, Zoom, Expand } });
    const fullscreenui = new Fullscreen({
      view: view
    });
    const zoomui = new Zoom({
      view: view
    });
    const expand = new Expand({
      expandTooltip: "ค้นหา",
      view: view,
      autoCollapse: false,
      // collapseIconClass:'esri-icon-search',
      expandIconClass: 'esri-icon-search',
      content: refdrawn.current,
    });
    const detaillayer = new Expand({
      view: view,
      content: refdetail.current,
      expandIconClass: "esri-icon-notice-round",
    });
    view.ui.add('button-top', "top-left");

    view.ui.add(expand, "top-right");
    view.ui.add(fullscreenui, "top-right");
    view.ui.add(zoomui, "top-right");
    view.ui.add(detaillayer, "top-right");

    setStateMap(map);
    setStateView(view);
    const { Graphic, GraphicsLayer } = await loadModules(["esri/Graphic", "esri/layers/GraphicsLayer"]).then(([Graphic, GraphicsLayer]) => { return { Graphic, GraphicsLayer } });

    let layer = new GraphicsLayer({
      id: 'poi'
    });
    map.add(layer, 99);

    socket.on("latlng", async (latlng) => {
      Status_cal(latlng);
      setTabledata(latlng);
      view.ui.add(["divtable", document.querySelector('.ant-table-wrapper')], "bottom-left");
      // console.log('latlng :>> ', latlng);
      layer.removeAll();
      latlng.map((data) => {
        const point = {
          type: "point", // autocasts as new Point()
          longitude: data.longitude,
          latitude: data.latitude
        };
        const markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: data.type == 'warning' ? [255, 128, 0] : [226, 255, 40],
          outline: {
            color: [0, 0, 0],
            width: 1
          },
          style: data.type == 'warning' ? 'triangle' : 'circle'
        };
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          popupTemplate: {
            title: "TestData",
            content: `sadsadsad`
          },
          id: 'poi',
          attributes: {
            "name": "poi",
          }
        });
        layer.add(pointGraphic);
        // view?.graphics?.addMany([pointGraphic]);
      })
    })
  }
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map className="Mapacrgis" onLoad={Onload} mapProperties={{ basemap: `${'arcgis-light-gray' ?? 'arcgis-navigation'}`, autoResize: false, }} viewProperties={{ center: [100.3330867, 14.5548052], ui: { components: ['attribution', 'compass'] } }} >
        <div id='button-top' className='button-topleft'>
          <div className='esri-widget--button esri-icon-table' onClick={() => {
            if (document.querySelector('.esri-ui-bottom-left').style.display === "none" || document.querySelector('.esri-ui-bottom-left').style.display === "") {
              document.querySelector('.esri-ui-bottom-left').style.setProperty("display", "block", "important")
            } else {
              document.querySelector('.esri-ui-bottom-left').style.setProperty("display", "none", "important")
            }
          }} />
        </div>
        <div ref={refdrawn} id="viewtest" className='menuserchslide esri-widget' >
          <Form labelCol={{ span: 9 }} wrapperCol={{ span: 16 }} name="nest-messages" >
            <Form.Item name={['user', 'name']} label="วันเวลา เริ้มต้น" rules={[{ required: true }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item name={['user', 'email']} label="วันเวลา สิ้นสุด" rules={[{ type: 'email' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item name={['user', 'age']} label="สถานที่ปฎิบัติงาน" rules={[{ type: 'number', min: 0, max: 99 }]}>
              <InputNumber size='small' />
            </Form.Item>
            <Form.Item name={['user', 'website']} label="ประเภทใบอนุญาติ">
              <Input size='small' />
            </Form.Item>
            <Form.Item name={['user', 'website']} label="หัวข้อการค้นหา">
              <Select
                mode="multiple"
                showArrow
                tagRender={tagRender}
                style={{ width: '100%' }}
                options={options}
              />
            </Form.Item>
            <Form.Item name={['user', 'introduction']} label="Introduction">
              <Input.TextArea size='ข้อเสนอแนะ' />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 16, offset: 18 }} >
              <Button type="primary" htmlType="submit">
                ค้นหา
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div ref={refdetail} className="menuserchslide detailemo esri-widget">
          <Row>
            <Col span={8}>
              <p>ใช้ 8 สีแทนประเภท</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '5px' }}>
                <span>🔴</span>
                <span>🟠</span>
                <span>🟡</span>
                <span>🟢</span>
                <span>🔵</span>
              </div>
            </Col>
            <Col span={8}>
              <p>ใช้ 2 สีแทนประเภท</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '5px' }}>
                <span>🟢</span>
                <span>🔵</span>
              </div>
            </Col>
            <Col span={8}>
              <p>ใช้สัญลักษณ์แทนการแจ้งเตือน</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '5px' }}>
                <span>🚸</span>
                <span>⛔</span>
                <span>✅</span>
                <span>🛑</span>
                <span>🚯</span>
              </div>
            </Col>
          </Row>
        </div>
        <Table id="divtable" rowClassName={(record, index) => record.type === 'warning' ? 'table-row-red' : ''} rowKey={(i) => i.phone} columns={columns} dataSource={tabledata} />

      </Map>

      {/* <div id="viewDiv" style={{height:'70vh'}}></div> */}

      <Modal title="รายละเอียด" onCancel={() => setIsModalVisible(!isModalVisible)} visible={isModalVisible} >
        {datamodal && Object.entries(datamodal).map(([key, value]) => (
          <Row key={key}>
            <Col span={12}>
              <a>{key}</a>
            </Col>
            <Col span={12}>
              {value}
            </Col>
          </Row>
        ))
        }
      </Modal>
    </div>
  )
}

export default Page1