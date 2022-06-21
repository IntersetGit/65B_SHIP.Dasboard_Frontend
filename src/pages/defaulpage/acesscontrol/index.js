import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Table,
  Tag,
  Space,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Modal,
  Drawer,
  DatePicker
} from 'antd';
import { Map, WebScene } from '@esri/react-arcgis';
import { loadModules } from 'esri-loader';
import './index.style.less';
import io from 'socket.io-client';
import socketClient from '../../../util/socket';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../../redux/actions';
import moment, { isMoment } from 'moment';
import Demodata from '../../demodata';
import WaGeojson from '../../../util/WaGeojson';
import { CreateIcon, CreateImgIcon } from '../../../util/dynamic-icon'
import API from '../../../util/Api'
import { isArray } from 'lodash';
import PTTlayers from '../../../util/PTTlayer'


const AcessControlPage = () => {
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
      title: 'เลข work',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => <a>{text}</a>,

    },
    {
      title: 'ผู้รับเหมา',
      dataIndex: 'VendorName',
      key: 'VendorName',


    },
    {
      title: 'เจ้าของพื้นที่',
      dataIndex: 'OwnerName',
      key: 'OwnerName',

    },
    {
      title: 'ผู้ควบคุมงาน',
      dataIndex: 'PTTStaff',
      key: 'PTTStaff',

    },
    {
      title: 'ประเภทใบอนุญาต',
      key: 'WorkpermitType',
      dataIndex: 'WorkpermitType',

    },
    {
      title: 'สถานที่ติดตั้ง',
      key: 'AreaName',
      dataIndex: 'AreaName',

    },
    {
      title: 'วัน-เวลา เริ่มต้น',
      dataIndex: 'date_time_start',
      key: 'date_time_start',

    },
    {
      title: 'วัน-เวลา สิ้นสุด',
      dataIndex: 'date_time_end',
      key: 'date_time_end',

    },
    {
      title: 'สถานะ work',
      dataIndex: 'WorkPermitStatus',
      key: 'WorkPermitStatus',

    },
    {
      title: 'สถานะแจ้งเตือน',
      dataIndex: 'WarningStatus',
      key: 'WarningStatus',

    },
    {
      title: '...',
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

  const getWorkpermit = async (item) => {
    let url = `/workpermit/all?`;
    if (item.PTTStaffCode) url += `&PTTStaffCode=${item.PTTStaffCode}`;
    if (item.VendorCode) url += `&VendorCode=${item.VendorCode}`;
    if (item.StartDateTime) url += `&StartDateTime=${item.StartDateTime}`;
    if (item.EndDateTime) url += `&EndDateTime=${item.EndDateTime}`;
    if (item.AreaID) url += `&AreaID=${item.AreaID}`;
    if (isArray(item.ScaffoldingType)) {
      url += `&ScaffoldingType=${item.ScaffoldingType.toString()}`;
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


  useEffect(() => {
    let isMounted = true;
    const socketio = new socketClient();
    const socket = socketio.io();

    initMap(socket)

    return () => {
      (isMounted = false), socket.disconnect();
    };
  }, [stateMap, stateView]);

  const initMap = async (socket) => {

    const resSf = await getWorkpermit({});
    setLayerpoint(resSf)
    socket.on("workpermit", (res) => {
      // console.log('socket', res)
      if (res.Status == "success") {
        setLayerpoint(res.Message)
      }
    });


  }

  const setLayerpoint = async (item) => {

    if (stateView) {

      // let latlng = item.data;
      Status_cal(item.summary);

      console.log("data =>>>>>>>>>>>>>>>>>", item.data);
      // console.log("summary =>>>>>>>>>>>>>>>>>", _summary);
      if (isArray(item.filter)) {
        const _filter = item.filter.map(e => {
          return {
            value: e._id
          }
        });
        // console.log('_filter', _filter)
        setScaffoldingTypeOptions(_filter)
      }

      let latlng = item.data.map(obj => {
        // console.log('obj', obj)
        return {
          ...obj,
          "id": obj._id,
          "work_number": obj.WorkPermitNo,
          "name": obj.Name,
          "licensor": obj.PTTStaff,
          "supervisor": obj.OwnerName,
          "date_time_start": moment(new Date(obj.EndDateTime)).format("DD/MM/YYYY hh:mm:ss"),
          "date_time_end": moment(new Date(obj.StartDateTime)).format("DD/MM/YYYY hh:mm:ss"),
          // "status_work": obj.WorkPermitStatus.toLowerCase()+'_normal',
          "status_work": `${obj.WorkPermitStatus}_normal`,
          "latitude": obj.FeaturesPropertiesCentroid_X,
          "longitude": obj.FeaturesPropertiesCentroid_Y,
          "locatoin": obj.SubAreaName,
          "work_type": obj.WorkpermitType,
        }

      })




      const [FeatureLayer, GeoJSONLayer] = await loadModules([
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
                size: '18px',
              },
              url: await CreateIcon('#ff7c44', 'warning'),
            },

            labelPlacement: 'center-center',
          },

        ],

      };
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
          uniqueValueInfos: await gen_uniqueValueInfos()


        },
      });
      await stateMap?.remove(stateMap?.findLayerById('pointlayer'));
      stateMap?.add(layerpoint);
    }
  }
  const gen_uniqueValueInfos = async () => {

    const uniqueValueInfos = [];

    const scaffoldingIcon = [
      {
        name: "Reject by Allower",
        img: '/assets/iconmap/scaffolding/0001.png'
      },
      {
        name: "Waiting for Close (Allower)",
        img: '/assets/iconmap/scaffolding/0002.png'
      },
      {
        name: "Reject by Approver",
        img: '/assets/iconmap/scaffolding/0003.png'
      },
      {
        name: "Waiting for QSHE",
        img: '/assets/iconmap/scaffolding/0004.png'
      },
    ]
    const scaffoldingStatusWork = [
      {
        name: "near_expire",
        status: "warning",
      },
      {
        name: "expire",
        status: "warningWork",
      },
      {
        name: "normal",
        status: false,
      },
    ]


    for (const x in scaffoldingIcon) {
      if (Object.hasOwnProperty.call(scaffoldingIcon, x)) {
        const a = scaffoldingIcon[x];
        for (const y in scaffoldingStatusWork) {
          if (Object.hasOwnProperty.call(scaffoldingStatusWork, y)) {
            const b = scaffoldingStatusWork[y];
            uniqueValueInfos.push({
              value: `${a.name}_${b.name}`,
              symbol: {
                type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                url: await CreateImgIcon(a.img, b.status),
                width: '35px',
                height: '35px',
              },
            })
          }
        }
      }
    }

    console.log("uniqueValueInfos", uniqueValueInfos)

    return uniqueValueInfos

  }



  const Status_cal = async (data) => {

    // console.log('data', data)
    dispatch(
      setStatus({
        "จำนวน": data.all,
        "ปกติ": data.normal,
        "⚠️ ใกล้ Exp": data.near_expire,
        "‼️ หมด Exp": data.expire,
      }),
    );
  };

  const Onload = async (map, view) => {
    const [Fullscreen, UI, Zoom, Expand, Legend, Extent, locator, MapImageLayer] = await loadModules([
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
      element: document.querySelector("#pagediv"),
      id: 'fullscreenwiget'
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




    setStateMap(map);
    setStateView(view);

    // PTTlayer.ADDPTTWMSLAYER(map, view)
    // view.graphics.addMany(await PTTlayer.SHOW_AREALAYERNAME());

  };

  const reset = () => {
    form.resetFields()
    onFinish(form.getFieldValue())
  }

  const onFinish = async (value) => {
    try {
      // console.log('value', value)
      const model = {
        ...value,
        StartDateTime: isMoment(value.StartDateTime) ? value.StartDateTime.format(`YYYY-MM-DD HH:mm`) : "",
        EndDateTime: isMoment(value.EndDateTime) ? value.EndDateTime.format(`YYYY-MM-DD HH:mm`) : ""
      }
      // console.log('model', model)

      // console.log('first', getWorkpermit(model))
      setLayerpoint(await getWorkpermit(model))

    } catch (error) {
      console.log('error', error)
    }
  }

  const onFinishFailed = (error) => {
    console.log('error', error)
  }

  const [visible, setVisible] = useState(false);
  const [scaffoldingTypeOptions, setScaffoldingTypeOptions] = useState([]);
  const [form] = Form.useForm()

  return (
    <div id="pagediv">
      <Map
        className='Mapacrgis'
        onLoad={Onload}
        mapProperties={{
          basemap: `${'arcgis-navigation'}`,
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
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            name='nest-messages'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="PTTStaffCode"
              label='รหัสพนักงานผู้ควบคุม'
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="PTTStaffCode"
              label='หน่วยงานผู้ควบคุม'
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="StartDateTime"
              label='วัน-เวลา เริ่มต้น'
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="EndDateTime"
              label='วัน-เวลา สิ้นสุด'
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="AreaID"
              label='สถานที่ปฏิบัติงาน'
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="ScaffoldingType"
              label='ประเภทใบอนุญาต'
            >
              <Select
                mode='multiple'
                showArrow
                style={{ width: '100%' }}
                options={scaffoldingTypeOptions}
              />
            </Form.Item>

            <Form.Item
              name="ScaffoldingType"
              label='หัวหน้าการค้นหา'
            >
              <Select
                mode='multiple'
                showArrow
                style={{ width: '100%' }}
                options={scaffoldingTypeOptions}
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
        </div>
        <div ref={refdetail} className='esri-widget'>
          <div id="legendDiv"></div>
        </div>

      </Map>

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
        dataSource={tabledata}
      />
    </div>
  )
}
export default AcessControlPage;
