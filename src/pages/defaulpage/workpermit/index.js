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
import { loadModules, loadCss } from 'esri-loader';
import './index.style.less';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../../redux/actions';
import cars from '../../../../src/assets/iconmap/car/cars.png';
import Demodata from '../../demodata';
import WaGeojson from '../../../util/WaGeojson';
import { CreateIcon } from '../../../util/dynamic-icon'
import PTTlayers from '../../../util/PTTlayer'



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
  const PTTlayer = new PTTlayers();

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

      const [ FeatureLayer, GeoJSONLayer ] = await loadModules([
        'esri/layers/FeatureLayer',
        'esri/layers/GeoJSONLayer',
      ]);

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

        const layerpoint = new GeoJSONLayer({
          id: 'pointlayer',
          title: 'ใช้สีสัญลักษณ์แทนประเภท',
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
              {
                value: 'warning',
                symbol: {
                  type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                  url: await CreateIcon('#F54', false, 2),
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
    const [Fullscreen, UI, Zoom, Expand, Legend, Extent, locator, MapImageLayer ] = await loadModules([
      'esri/widgets/Fullscreen',
      'esri/views/ui/UI',
      'esri/widgets/Zoom',
      'esri/widgets/Expand',
      "esri/widgets/Legend",
      'esri/geometry/Extent',
      'esri/rest/locator',
      "esri/layers/MapImageLayer"
    ])
    const fullscreenui = new Fullscreen({
      view: view,
      element:document.querySelector("#pagediv"),
      id:'fullscreenwiget'
    });
    const zoomui = new Zoom({
      view: view,
    });
    const legend = new Legend({
      view,
      container: "legendDiv",
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



    PTTlayer.ADDPTTWMSLAYER(map, view)
    view.graphics.addMany(await PTTlayer.SHOW_AREALAYERNAME());
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
    <div id="pagediv">
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
                document.querySelector('.ant-table-wrapper').style.display ===
                'none' ||
                document.querySelector('.ant-table-wrapper').style.display ===
                ''
              ) {
                document
                  .querySelector('.ant-table-wrapper')
                  .style.setProperty('display', 'block', 'important');
              } else {
                document
                  .querySelector('.ant-table-wrapper')
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
        <div ref={refdetail} className='esri-widget'>
          <div id="legendDiv"></div>
        </div>

      </Map>

      <Table
        id='divtable'
        scroll={{ y: '25vh' }}
        size='small'
        style={{position:'absolute',bottom:0,backgroundColor:'white',display:'none'}}
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
    </div>
  );
};

export default Page1;
