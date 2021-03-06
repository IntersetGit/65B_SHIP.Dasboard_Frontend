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
} from 'antd';
import { Map, WebScene } from '@esri/react-arcgis';
import { setDefaultOptions, loadModules, loadCss } from 'esri-loader';
import './index.style.less';
import io from 'socket.io-client';
import DaraArea from './dataarea';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../../redux/actions';
import { object } from 'prop-types';
import cars from '../../../../src/assets/iconmap/car/cars.png';
import Demodata from '../../demodata';
import WaGeojson from '../../../util/WaGeojson';
import { CreateIcon } from '../../../util/dynamic-icon'


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

const Page1 = () => {
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);
  const refdrawn = useRef();
  const refdetail = useRef();
  const [tabledata, setTabledata] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [datamodal, setDatamodal] = useState(null);
  const dispatch = useDispatch();
  const datademo = new Demodata('workpermit');
  const Geojson = new WaGeojson();

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
      title: 'work_type',
      key: 'work_type',
      dataIndex: 'work_type',
      render: (tags) => (
        <>
          <Tag color={'blue'} key={tags}>
            {tags.toUpperCase()}
          </Tag>
        </>
      ),
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

  useEffect(() => {
    let isMounted = true;
    var loopdata;
    const socket = io.connect('http://localhost:3001');
    (async () => {
      const { WFSLayer, WMSLayer, Extent } = await loadModules(['esri/layers/WFSLayer', 'esri/layers/WMSLayer', "esri/geometry/Extent"]).then(
        ([WFSLayer, WMSLayer, Extent]) => ({ WFSLayer, WMSLayer, Extent }),
      );
      var layer = new WMSLayer({
        url: 'http://45.136.253.221:8080/geoserver/GeoServer_ITS/wms?request=GetCapabilities&service=WMS&version=1.3.0',
        sublayers: [
          {
            name: 'GeoServer_ITS:merge_area'
          }
        ],
      });
      layer.when(async (data) => {
        console.log('data', data.fullExtent.toJSON())
        let extent = new Extent(data.fullExtent.toJSON());
        // console.log('extent :>> ', extent.center);
        // await stateView?.goTo(extent.center)
      });
      stateMap?.add(layer);
      // CreateArea();

      const { FeatureLayer, GeoJSONLayer } = await loadModules([
        'esri/layers/FeatureLayer',
        'esri/layers/GeoJSONLayer',
      ]).then(([FeatureLayer, GeoJSONLayer]) => ({ FeatureLayer, GeoJSONLayer }));

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
              color: '#ffffff',
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
      loopdata = setInterval(async () => {
        let latlng = await datademo.getDemodata();
        let datageojson = await Geojson.CleateGeojson(latlng, 'Point');

        Status_cal(latlng);
        setTabledata(latlng);
        stateView?.ui?.add(
          ['divtable', document.querySelector('.ant-table-wrapper')],
          'bottom-left',
        );
        // console.log('datageojson :>> ', datageojson);
        const layerpoint = new GeoJSONLayer({
          id: 'pointlayer',
          title: 'Earthquakes from the last month',
          url: datageojson,
          copyright: 'USGS Earthquakes',
          field: 'status_work',
          featureReduction: clusterConfig,
          popupTemplate: {
            title: 'name {name}',
            content: 'name {name}',
            fieldInfos: [
              {
                fieldName: 'time',
                format: {
                  dateFormat: 'short-date-short-time',
                },
              },
            ],
          },
          renderer: {
            type: 'unique-value',
            field: 'status_work',
            symbol: {
              field: 'status_work',
              type: 'simple-marker',
              size: 15,
              color: [226, 255, 40],
              outline: {
                color: '#000',
                width: 1,
              },
            },
            uniqueValueInfos: [
              {
                value: 'open',
                symbol: {
                  type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                  url: await CreateIcon('#ff7c44', 'warning'),
                  width: '35px',
                  height: '35px',
                },
              },
              {
                value: 'close',
                symbol: {
                  type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                  url: await CreateIcon('#4460ff', false, 2),
                  width: '35px',
                  height: '35px',
                },
              },
            ]


          },
        });
        await stateMap?.remove(stateMap?.findLayerById('pointlayer'));
        stateMap?.add(layerpoint);
      }, 5000);
    })();
    return () => {
      (isMounted = false), socket.disconnect(), clearInterval(loopdata);
    };
  }, [stateMap, stateView]);

  loadModules([
    'esri/config',
    'esri/Map',
    'esri/views/MapView',
    'esri/layers/TileLayer',
  ]).then(async ([esriConfig, Map, MapView, TileLayer]) => {
    esriConfig.apiKey =
      'AAPKf24959e55476492eb12c8cbaa4d1261etdgkaLK718fs8_EuvckemKt2gyRR-8p04PR7mC2G8Oi5oNli_65xV-C8u8BuPQTZ';
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
      // console.log('polygon.extent :>> ', polygon.extent.toJSON());

      // })
    }
  };

  const Status_cal = async (data) => {
    let warning = data.filter((data, key) => data.status_warnning !== null);
    const sum = data.map((data, key) => data.status_work);
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
    const { Fullscreen, UI, Zoom, Expand, Extent, locator } = await loadModules([
      'esri/widgets/Fullscreen',
      'esri/views/ui/UI',
      'esri/widgets/Zoom',
      'esri/widgets/Expand',
      'esri/geometry/Extent',
      'esri/rest/locator',
    ]).then(([Fullscreen, UI, Zoom, Expand, Extent, locator]) => {
      return { Fullscreen, UI, Zoom, Expand, Extent, locator };
    });
    const fullscreenui = new Fullscreen({
      view: view,
    });
    const zoomui = new Zoom({
      view: view,
    });
    const expand = new Expand({
      expandTooltip: '???????????????',
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
    const geocodingServiceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
    view.on("click", function (event) {
      event.stopPropagation(); // overwrite default click-for-popup behavior
      // console.log('event.mapPoint :>> ', event.mapPoint);
      var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
      var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
      view.popup.open({
        title: "??????????????????????????????????????????: [" + lon + ", " + lat + "]",
        location: event.mapPoint // Set the location of the popup to the clicked location
      });
      // Display the popup
      locator.locationToAddress(geocodingServiceUrl, { location: event.mapPoint }).then((res) => {
        view.popup.content = res.address;
      })
    });

    setStateMap(map);
    setStateView(view);

    // view.watch('updating', function (val) {
    //   const ext = new Extent({
    //     type: 'extent',
    //     spatialReference: { wkid: 4326 },
    //     xmax: 100.32800674438477,
    //     xmin: 100.30938148498534,
    //     ymax: 13.785986924617411,
    //     ymin: 13.767647416498118,
    //   });
    //   if (!view.extent.intersects(ext)) {
    //     view.goTo(ext);
    //   }
    // });
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map
        className='Mapacrgis'
        onLoad={Onload}
        mapProperties={{
          basemap: `${'arcgis-navigation'}`,
          autoResize: false,
          // extent: {
          //   type:'extent',
          //   spatialReference: { wkid: 4326 },
          //   xmax: 100.32800674438477,
          //   xmin: 100.30938148498534,
          //   ymax: 13.785986924617411,
          //   ymin: 13.767647416498118,
          // },
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
              if (
                document.querySelector('.esri-ui-bottom-left').style.display ===
                'none' ||
                document.querySelector('.esri-ui-bottom-left').style.display ===
                ''
              ) {
                document
                  .querySelector('.esri-ui-bottom-left')
                  .style.setProperty('display', 'block', 'important');
              } else {
                document
                  .querySelector('.esri-ui-bottom-left')
                  .style.setProperty('display', 'none', 'important');
              }
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
          >
            <Form.Item
              name={['user', 'name']}
              label='????????????????????? ????????????????????????'
              rules={[{ required: true }]}
            >
              <Input size='small' />
            </Form.Item>
            <Form.Item
              name={['user', 'email']}
              label='????????????????????? ?????????????????????'
              rules={[{ type: 'email' }]}
            >
              <Input size='small' />
            </Form.Item>
            <Form.Item
              name={['user', 'age']}
              label='???????????????????????????????????????????????????'
              rules={[{ type: 'number', min: 0, max: 99 }]}
            >
              <InputNumber size='small' />
            </Form.Item>
            <Form.Item name={['user', 'website']} label='?????????????????????????????????????????????'>
              <Input size='small' />
            </Form.Item>
            <Form.Item name={['user', 'website']} label='??????????????????????????????????????????'>
              <Select
                mode='multiple'
                showArrow
                tagRender={tagRender}
                style={{ width: '100%' }}
                options={options}
              />
            </Form.Item>
            <Form.Item name={['user', 'introduction']} label='Introduction'>
              <Input.TextArea size='??????????????????????????????' />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 16, offset: 18 }}>
              <Button type='primary' htmlType='submit'>
                ???????????????
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div ref={refdetail} className='menuserchslide detailemo esri-widget'>
          <Row>
            <Col span={8}>
              <p>????????? 8 ?????????????????????????????????</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridGap: '5px',
                }}
              >
                <span>????</span>
                <span>????</span>
                <span>????</span>
                <span>????</span>
                <span>????</span>
              </div>
            </Col>
            <Col span={8}>
              <p>????????? 2 ?????????????????????????????????</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridGap: '5px',
                }}
              >
                <span>????</span>
                <span>????</span>
              </div>
            </Col>
            <Col span={8}>
              <p>?????????????????????????????????????????????????????????????????????????????????</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridGap: '5px',
                }}
              >
                <span>????</span>
                <span>???</span>
                <span>???</span>
                <span>????</span>
                <span>????</span>
              </div>
            </Col>
          </Row>
        </div>
        <Table
          id='divtable'
          scroll={{ y: '25vh' }}
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
        title='??????????????????????????????'
        okButtonProps={{ hidden: true }}
        onCancel={() => setIsModalVisible(!isModalVisible)}
        visible={isModalVisible}
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
    </div>
  );
};

export default Page1;
