import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table, Tag, Space, Form, Input, InputNumber, Button, Select } from 'antd';
import { Map, WebScene, } from '@esri/react-arcgis';
import { setDefaultOptions, loadModules } from 'esri-loader';
import './index.style.less';

setDefaultOptions({ css: true });

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
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const Page1 = () => {
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);
  const refdrawn = useRef();
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
      GetCluster()
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





  const GetCluster = async () => {
    loadModules([
      "esri/layers/FeatureLayer",
      "esri/layers/GeoJSONLayer",
      "esri/views/MapView",
      "esri/widgets/Legend",
      "esri/widgets/Expand",
      "esri/widgets/Home",
      "esri/Graphic"
    ])
      .then(([FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home, Graphic]) => {
        const clusterConfig = {
          type: "cluster",
          clusterRadius: "100px",
          // {cluster_count} is an aggregate field containing
          // the number of features comprised by the cluster
          popupTemplate: {
            title: "Cluster summary",
            content: "This cluster represents {cluster_count} earthquakes.",
            fieldInfos: [
              {
                fieldName: "cluster_count",
                format: {
                  places: 0,
                  digitSeparator: true
                }
              }
            ]
          },
          clusterMinSize: "24px",
          clusterMaxSize: "60px",
          labelingInfo: [
            {
              deconflictionStrategy: "none",
              labelExpressionInfo: {
                expression: "Text($feature.cluster_count, '#,###')"
              },
              symbol: {
                type: "text",
                color: "#004a5d",
                font: {
                  weight: "bold",
                  family: "Noto Sans",
                  size: "12px"
                }
              },
              labelPlacement: "center-center"
            }
          ]
        };

        const layer = new GeoJSONLayer({
          title: "Earthquakes from the last month",
          url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
          copyright: "USGS Earthquakes",

          featureReduction: clusterConfig,

          // popupTemplates can still be viewed on
          // individual features
          popupTemplate: {
            title: "Magnitude {mag} {type}",
            content: "Magnitude {mag} {type} hit {place} on {time}",
            fieldInfos: [
              {
                fieldName: "time",
                format: {
                  dateFormat: "short-date-short-time"
                }
              }
            ]
          },
          renderer: {
            type: "simple",
            field: "mag",
            symbol: {
              type: "simple-marker",
              size: 4,
              color: "#69dcff",
              outline: {
                color: "rgba(0, 139, 174, 0.5)",
                width: 5
              }
            }
          }
        });

        const point = {
          type: "point", // autocasts as new Point()
          longitude: -49.97,
          latitude: 41.73
        };
        const markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        };
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol
        });
        stateView?.graphics?.addMany([pointGraphic]);
        // stateMap?.add(layer);
      });


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
      expanded: true
    });

    view.ui.add(expand, "top-right");


    // view.ui.add("drawnerright", "top-right");
    view.ui.add(fullscreenui, "top-right");
    view.ui.add(zoomui, "top-right");

    setStateMap(map);
    setStateView(view);
    // console.log('map,view :>> ', map, view);
  }
  return (
    <div>
      <Map className="Map" onLoad={Onload} mapProperties={{ basemap: `${'arcgis-light-gray' ?? 'arcgis-navigation'}`, autoResize: false, }} viewProperties={{ center: [100.3330867, 14.5548052], ui: { components: ['attribution', 'compass'] } }} >
        <div ref={refdrawn} className="esri-widget menuserchslide">
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
                defaultValue={['gold', 'cyan']}
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

      </Map>

      {/* <div id="viewDiv" style={{height:'70vh'}}></div> */}
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default Page1