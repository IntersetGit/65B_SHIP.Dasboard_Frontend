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
import { isArray, isPlainObject } from 'lodash';
import PTTlayers from '../../../util/PTTlayer'
import { stringify } from 'querystring';


const WorkpermitPage = () => {
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);
  const refdrawn = useRef();
  const refdetail = useRef();
  const [tabledata, setTabledata] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [datamodal, setDatamodal] = useState(null);
  const dispatch = useDispatch();
  const demodata = new Demodata('workpermit');
  const Geojson = new WaGeojson();
  const PTTlayer = new PTTlayers();
  const [state_WorkpermitType, setState_WorkpermitType] = useState();

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

  const [loading, setloading] = useState(false);
  const getWorkpermit = async (item, openTableBool) => {
    try {
      setloading(true);
      let url = `/workpermit/all?`;
      if (item.PTTStaffID) url += `&PTTStaffID=${item.PTTStaffID}`;
      if (item.AgencyID) url += `&AgencyID=${item.AgencyID}`;
      if (item.StartDateTime) url += `&StartDateTime=${item.StartDateTime}`;
      if (item.EndDateTime) url += `&EndDateTime=${item.EndDateTime}`;
      if (isArray(item.WorkPermitStatusID)) {
        url += `&WorkPermitStatusID=${item.WorkPermitStatusID.toString()}`;
      }
      if (isArray(item.WorkpermitTypeID)) {
        url += `&WorkpermitTypeID=${item.WorkpermitTypeID.toString()}`;
      }
      const { data } = await API.get(url);
      if (openTableBool) openTable()
      setloading(false);
      return data.Status === 'success' ? data.Message : {
        data: [],
        summary: {
          all: 0,
          expire: 0,
          near_expire: 0,
        }
      }
    } catch (error) {
      setloading(false);
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
    console.log('resSf :>> ', resSf);
    socket.on("workpermit", (res) => {
      if (res.Status == "success") {
        setLayerpoint(res.Message)
      }
    });


  }

  const [AgencyIDOptions, setAgencyIDOptions] = useState([]);
  const [PTTStaffIDOptions, setPTTStaffIDOptions] = useState([]);
  const [WorkPermitStatusIDOptions, setWorkPermitStatusIDOptions] = useState([]);
  const [WorkpermitTypeIDOptions, setWorkpermitTypeIDOptions] = useState([]);

  const setLayerpoint = async (item) => {
    console.log('item', item, stateView)
    // if (stateView) {

    // let latlng = item.data;
    Status_cal(item.summary);

    // console.log("data =>>>>>>>>>>>>>>>>>", item.data);
    if (isPlainObject(item.filter)) {
      if (isArray(item.filter.AgencyID)) setAgencyIDOptions(item.filter.AgencyID.map(e => { return { value: e } }))
      if (isArray(item.filter.PTTStaffID)) setPTTStaffIDOptions(item.filter.PTTStaffID.map(e => { return { value: e } }))
      if (isArray(item.filter.WorkPermitStatusID)) setWorkPermitStatusIDOptions(item.filter.WorkPermitStatusID.map(e => { return { value: e } }))
      if (isArray(item.filter.WorkpermitTypeID)) setWorkpermitTypeIDOptions(item.filter.WorkpermitTypeID.map(e => { return { value: e } }))
    }


    let GetAllArea = await PTTlayer.SHOW_AREALAYERNAME();
    let getcenterarea = await GetAllArea[0].queryExtent();
    // console.log('getcenterarea :>> ', getcenterarea.extent.center.latitude);

    let latlng = []
    for (const opp in item.data) {
      const obj = item.data[opp];
      // let latlng = item.data.map(async obj => {

      // console.log('obj', obj)
      // let findeArea = GetAllArea.find((area) => area.attributes.UNITNAME == (obj.AreaName).replace(/#/i, ''));
      let findeArea = GetAllArea.find(async (area) => {
        let feature = await area.queryFeatures();
        if (feature.features[0].attributes.UNITNAME == (obj.AreaName).replace(/#/i, '')) {
          return area;
        }
      });
      let getextentcenter = await findeArea.queryExtent();
      // console.log('getextentcenter :>> ', getextentcenter.extent.center.latitude);
      let randomlatlng = demodata.getRandomLocation(getextentcenter?.extent?.center?.latitude, getextentcenter?.extent?.center?.longitude, 40)
      // console.log('randomlatlng :>> ', randomlatlng);
      latlng.push({
        ...obj,
        "id": obj._id,
        "work_number": obj.WorkPermitNo,
        "name": obj.Name,
        "licensor": obj.PTTStaff,
        "supervisor": obj.OwnerName,
        "date_time_start": moment(new Date(obj.EndDateTime)).format("DD/MM/YYYY hh:mm:ss"),
        "date_time_end": moment(new Date(obj.StartDateTime)).format("DD/MM/YYYY hh:mm:ss"),
        // "status_work": obj.WorkPermitStatus.toLowerCase()+'_normal',
        "status_work": `${obj.WorkpermitTypeID}_${obj.WorkPermitStatusID}${obj.GasMeasurement ? '_Gas' : ''}`,
        "latitude": randomlatlng.latitude,
        "longitude": randomlatlng.longitude,
        "locatoin": obj.SubAreaName,
        "work_type": obj.WorkpermitType,
      })

      //})
    }
    const clusterConfig = {
      type: "cluster",
      clusterRadius: "20px",
      labelsVisible: true,
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
      labelingInfo: [{
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')"
        },
        symbol: {
          type: "text",
          color: "#FFF",
          haloSize: "2px",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "18px"
          },
          xoffset: 0,
          yoffset: 0
        },
        labelPlacement: "center-center",
      }],

    };


    Status_cal(latlng);
    setTabledata(latlng);

    let datageojson = await Geojson.CleateGeojson(latlng, 'Point');
    Status_cal(latlng);
    setTabledata(latlng);
    const [FeatureLayer, GeoJSONLayer] = await loadModules([
      'esri/layers/FeatureLayer',
      'esri/layers/GeoJSONLayer',
    ]);
    const layerpoint = new GeoJSONLayer({
      id: 'pointlayer',
      title: 'ใช้สีสัญลักษณ์แทนประเภท',
      url: datageojson,
      copyright: 'USGS Earthquakes',
      field: 'status_work',
      featureReduction: clusterConfig,
      popupTemplate: {
        title: "ชื่อผู้รับเหมา: {Name}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "WorkPermitNo",
                label: "เลข Workpermit"
              },
              {
                fieldName: "WorkPermitType",
                label: "ประเภทใบงาน"
              },
              {
                fieldName: "WorkPermitStatus",
                label: "สถานะใบงาน"
              },
              {
                fieldName: "GasMeasurement",
                label: "แจ้งเตือนแก๊ส"
              }
            ]
          }
        ]
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
        uniqueValueInfos: await gen_uniqueValueInfos(item.filter.WorkpermitTypeID, item.filter.WorkPermitStatusID)


      },
    });
    await stateMap?.remove(stateMap?.findLayerById('pointlayer'));
    stateMap?.add(layerpoint);
    // }
  }
  const gen_uniqueValueInfos = async (type, status) => {
    const uniqueValueInfos = [];

    const scaffoldingIcon = [
      {
        name: "SF",
        color: "rgba(106, 61, 154)"
      },
      {
        name: "CD",
        color: "rgba(251, 154, 153)"
      },
      {
        name: "HT1",
        color: "rgba(255, 127, 0)"
      },
      {
        name: "RD",
        color: "rgba(51, 160, 44)"
      },
    ]

    const open = ['W02', 'W03', 'W04', 'W07', 'W08', 'W09', 'W11', 'W12', 'W13', 'W15', 'W18', 'W19']
    const close = ['W05', 'W06', 'W10']

    const scaffoldingStatusWork = [
      {
        name: "near_expire",
        status: "warning",
      },
      {
        name: "Gas",
        status: "warningGas",
      },
      {
        name: "",
        status: false,
      },
    ]


    for (const x in scaffoldingIcon) {
      if (Object.hasOwnProperty.call(scaffoldingIcon, x)) {
        const a = scaffoldingIcon[x];
        for (const y in scaffoldingStatusWork) {
          if (Object.hasOwnProperty.call(scaffoldingStatusWork, y)) {
            const b = scaffoldingStatusWork[y];
            for (const s in status) {
              let typedraw;
              if (open.some(i => i == status[s])) {
                typedraw = 1
              } else if (close.some(i => i == status[s])) {
                typedraw = 2
              } else {
                typedraw = 1
              }
              uniqueValueInfos.push({
                value: `${a.name}_${status[s]}${b.name !== '' ? '_' + b.name : ''}`,
                symbol: {
                  type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                  url: await CreateIcon(a.color, b.status, typedraw),
                  width: '15px',
                  height: '15px',
                },
              })
            }
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

    view.watch('zoom', zoomChanged);
    function zoomChanged(newValue, oldValue, property, object) {
      console.log("New value: ", newValue,
        "<br>Old value: ", oldValue,
        "<br>Watched property: ", property,
        "<br>Watched object: ", object);
    }


    PTTlayer.ADDPTTWMSLAYER(map, view)
    map.addMany(await PTTlayer.SHOW_AREALAYERNAME());
    setStateMap(map);
    setStateView(view);

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
      setLayerpoint(await getWorkpermit(model, true))

    } catch (error) {
      console.log('error', error)
    }
  }

  const onFinishFailed = (error) => {
    console.log('error', error)
  }

  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm()

  const openTable = () => {
    document.querySelector('.ant-table-wrapper').style.setProperty('display', 'block', 'important');
  }

  const closeTable = () => {
    document.querySelector('.ant-table-wrapper').style.setProperty('display', 'none', 'important');
  }
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
                // document
                //   .querySelector('.ant-table-wrapper')
                //   .style.setProperty('display', 'block', 'important');
                openTable()
              } else {
                // document
                //   .querySelector('.ant-table-wrapper')
                //   .style.setProperty('display', 'none', 'important');
                closeTable()
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
              name="PTTStaffID"
              label='รหัสพนักงานผู้ควบคุมงาน'
            >
              <Select
                showArrow
                loading={loading}
                style={{ width: '100%' }}
                options={PTTStaffIDOptions}
              />
            </Form.Item>

            <Form.Item
              name="AgencyID"
              label='รหัสหน่วยงานผู้ควบคุม'
            >
              <Select
                loading={loading}
                showArrow
                style={{ width: '100%' }}
                options={AgencyIDOptions}
              />
            </Form.Item>

            <Form.Item
              name="StartDateTime"
              label='วัน-เวลา เริ่มต้น'
            >
              <DatePicker
                loading={loading}
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="EndDateTime"
              label='วัน-เวลา สิ้นสุด'
            >
              <DatePicker
                loading={loading}
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="WorkPermitStatusID"
              label='ประเภทใบอนุญาต'
            >
              <Select
                loading={loading}
                mode='multiple'
                showArrow
                style={{ width: '100%' }}
                options={WorkPermitStatusIDOptions}
              />
            </Form.Item>

            <Form.Item
              name="WorkpermitTypeID"
              label='หัวหน้าการค้นหา'
            >
              <Select
                loading={loading}
                mode='multiple'
                showArrow
                style={{ width: '100%' }}
                options={WorkpermitTypeIDOptions}
              />

            </Form.Item>

            <Form.Item wrapperCol={{ span: 24, offset: 5 }} style={{ textAlign: "end" }}>

              <Button type='primary' htmlType='submit' style={{ width: 100 }} loading={loading}>
                ค้นหา
              </Button>
              <span style={{ paddingRight: 5 }} />
              <Button style={{ width: 100 }} onClick={reset} loading={loading}>
                ค่าเริ่มต้น
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div ref={refdetail} className='esri-widget'>
          <div id="legendDiv"></div>
        </div>

      </Map>
      <Modal
        title='รายละเอียด'
        okButtonProps={{ hidden: true }}
        onCancel={() => setIsModalVisible(!isModalVisible)}
        visible={isModalVisible}
      >
        {datamodal &&
          Object.entries(datamodal).map(([key, value]) => (
            !(typeof value == 'object') &&
            <Row key={key}>
              <Col span={12}>
                <a>{key}</a>
              </Col>
              {console.log(value)}
              <Col span={12}>{value}</Col>
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
        dataSource={tabledata}
      />
    </div>
  )
}
export default WorkpermitPage;
