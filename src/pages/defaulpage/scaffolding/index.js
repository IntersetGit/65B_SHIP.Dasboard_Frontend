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
  Collapse,
  DatePicker
} from 'antd';
import { Map, WebScene } from '@esri/react-arcgis';
import { loadModules } from 'esri-loader';
import './index.style.less';
import socketClient from '../../../util/socket';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../../redux/actions';
import moment, { isMoment } from 'moment';
import WaGeojson from '../../../util/WaGeojson';
import { CreateIcon, CreateImgIcon } from '../../../util/dynamic-icon'
import API from '../../../util/Api'
import { isArray, isPlainObject } from 'lodash';
import PTTlayers from '../../../util/PTTlayer'

const { Panel } = Collapse;


const ScaffoldingPage = () => {
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);
  const refdrawn = useRef();
  const refdetail = useRef();
  const [tabledata, setTabledata] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [datamodal, setDatamodal] = useState(null);
  const dispatch = useDispatch();
  const Geojson = new WaGeojson();
  const PTTlayer = new PTTlayers();
  const [stateSysmbole, setstateSysmbole] = useState(null);
  const columns2 = [
    {
      title: 'เลข work',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'ชื่อ-สกุล ผู้รับเหมา',
      dataIndex: 'WorkName',
      key: 'WorkName',
      render: (text) => text ?? "-",
      width: 250

    },
    {
      title: 'เจ้าของพื้นที่',
      dataIndex: 'OwnerName',
      key: 'OwnerName',
      render: (text) => text ?? "-",
      width: 200
    },
    {
      title: 'ผู้ควบคุมงาน',
      dataIndex: 'PTTStaff',
      key: 'PTTStaff',
      render: (text) => text ?? "-",
      width: 200
    },
    {
      title: 'ประเภทใบอนุญาต',
      key: 'WorkpermitType',
      dataIndex: 'WorkpermitType',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'สถานที่ติดตั้ง',
      key: 'AreaName',
      dataIndex: 'AreaName',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'วันหมดอายุ',
      key: 'ExpiredDate',
      dataIndex: 'ExpiredDate',
      render: (text) => text ? moment(new Date(text)).format("YYYY-MM-DD") : "-",
      width: 150
    },
    {
      title: 'วัน-เวลา เริ่มต้น',
      dataIndex: 'WorkingStartDate',
      key: 'WorkingStartDate',
      render: (text) => text ? moment(new Date(text)).format("YYYY-MM-DD HH:mm:ss") : "-",
      width: 200
    },
    {
      title: 'วัน-เวลา สิ้นสุด',
      dataIndex: 'WorkingEndDate',
      key: 'WorkingEndDate',
      render: (text) => text ? moment(new Date(text)).format("YYYY-MM-DD HH:mm:ss") : "-",
      width: 200
    },
    {
      title: 'สถานะ work',
      dataIndex: 'StatusName',
      key: 'StatusName',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'สถานะแจ้งเตือน',
      dataIndex: 'WarningStatus',
      key: 'WarningStatus',
      render: (text, record) => record.others.StatusName ?? "-",
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
                setDatamodal({

                  "เลขที่นั่งร้าน": record.ScaffoldingCode ?? "-",
                  "ประเภทผู้ขอรายการ": record.OwnerType == 1 ? "พนักงาน ปตท." : record.OwnerType == 2 ? "ผู้รับเหมา" : "-",
                  "รหัสผู้ขอรายการ": record.WorkOwnerID ?? "-",
                  "ชื่อ นามสกุล": record.WorkName ?? "-",
                  "เลขบัตรประชาชน": record.PersonalID ?? "-",
                  "เลข Work Permit": record.WorkPermitNo ?? "-",
                  "รหัสประเภทนั่งร้าน": record.ScaffoldingTypeID ?? "-",
                  "ชื่องาน": record.Title ?? "-",
                  "รายละเอียดของงาน": record.Description ?? "-",
                  "วัตถุประสงค์": record.Objective ?? "-",
                  "วันหมดอายุสภาพนั่งร้าน": record.ExpiredDate ? moment(new Date(record.ExpiredDate)).format("YYYY-MM-DD") : "-",
                  "รหัสสถานที่ปฏิบัติงานหลัก": record.Area ?? "-",
                  "ชื่อสถานที่ปฏิบัติงานหลัก": record.AreaName ?? "-",
                  "รหัสสถานที่ปฏิบัติงานย่อย": record.SubArea ?? "-",
                  "ชื่อสถานที่ปฏิบัติงานย่อย": record.SubAreaName ?? "-",
                  // "ข้อมูลพิกัดนั่งร้าน": record.Features ?? "-",
                  // "ข้อมูลคุณสมบัตินั่งร้าน": record.FeaturesProperties ?? "-",
                  "วัน เวลา เริ่มต้นการปฏิบัติงาน": record.WorkingStartDate ? moment(new Date(record.WorkingStartDate)).format("YYYY-MM-DD HH:mm:ss") : "-",
                  "วัน เวลา สิ้นสุดการปฏิบัติงาน": record.WorkingEndDate ? moment(new Date(record.WorkingEndDate)).format("YYYY-MM-DD HH:mm:ss") : "-",
                  "รหัสบริษัท": record.VendorCode ?? "-",
                  "ชื่อบริษัท": record.VendorName ?? "-",
                  "รหัสผู้ควบคุมงาน": record.PTTStaffCode ?? "-",
                  "ชื่อผู้ควบคุมงาน": record.PTTStaff ?? "-",
                  "รหัสหน่วยงานผู้ควบคุม": record.AgencyID ?? "-",
                  "ชื่อหน่วยงานผู้ควบคุม": record.AgencyName ?? "-",
                  "รหัสเจ้าของพื้นที่": record.Owner ?? "-",
                  "ประเภทของ Work": record.WorkpermitType ?? "-",
                  "สถานะใบงาน": record.StatusName ?? "-",
                  "สถานะแจ้งเตือน": record.others.StatusName ?? "-",

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


    /* Layerpoint */
    const resSf = await getScaffolding({});
    // console.log('resSf :>> ', resSf);
    setLayerpoint(resSf)
    // socket.on("scaffolding", (res) => {
    //   // console.log('socket', res)
    //   if (res.Status == "success") {
    //     setLayerpoint(res.Message)
    //   }
    // });

    socket.on("scaffolding", async (res) => {
      const resSf = await getScaffolding(form.getFieldValue());
      setLayerpoint(resSf)
    });


  }

  const [ScaffoldingType, setScaffoldingType] = useState([]);
  const [AgencyName, setAgencyName] = useState([]);
  const [AreaName, setAreaName] = useState([]);
  const [PTTStaffCode, setPTTStaffCode] = useState([]);

  const setLayerpoint = async (item) => {

    if (stateView) {

      // let latlng = item.data;
      Status_cal(item.summary);
      // console.log('item', item)
      // console.log("data =>>>>>>>>>>>>>>>>>", item.data);
      // console.log("summary =>>>>>>>>>>>>>>>>>", _summary);
      if (isPlainObject(item.filter)) {
        if (isArray(item.filter.AgencyName)) setAgencyName(item.filter.AgencyName.map(e => { return { value: e.AgencyName } }))
        if (isArray(item.filter.AreaName)) setAreaName(item.filter.AreaName.map(e => { return { value: e.AreaName } }))
        if (isArray(item.filter.PTTStaffCode)) setPTTStaffCode(item.filter.PTTStaffCode.map(e => { return { value: e.PTTStaffCode } }))
        if (isArray(item.filter.PTTStaffCode)) setPTTStaffCode(item.filter.PTTStaffCode.map(e => { return { value: e.PTTStaffCode } }))
        if (isArray(item.filter.ScaffoldingType)) setScaffoldingType(item.filter.ScaffoldingType.map(e => { return { value: e.ScaffoldingType } }))
      }

      let latlng = item.data.map(obj => {
        // console.log('status_work', `A${obj.ScaffoldingTypeID}_${obj.Status.toLowerCase()}`)

        return {
          ...obj,
          "id": obj._id,
          "work_number": obj.WorkPermitNo,
          "name": obj.Name,
          "licensor": obj.PTTStaff,
          "supervisor": obj.OwnerName,
          "date_time_start": moment(new Date(obj.EndDateTime)).format("DD/MM/YYYY HH:mm:ss"),
          "date_time_end": moment(new Date(obj.StartDateTime)).format("DD/MM/YYYY HH:mm:ss"),
          // "status_work": obj.WorkPermitStatus.toLowerCase(),
          "status_work": `A${obj.ScaffoldingTypeID}_${obj.others?.StatusName}`,
          "latitude": obj.FeaturesPropertiesCentroid_X,
          "longitude": obj.FeaturesPropertiesCentroid_Y,
          "locatoin": obj.SubAreaName,
          "work_type": obj.WorkpermitType,
        }

      })

      // latlng = await datademo.getDemodata();
      // console.log('latlng', latlng)
      setTabledata(latlng);

      const datageojson = await Geojson.CleateGeojson(latlng, 'Point');
      // console.log('datageojson:>> ', datageojson);
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
              color: '#000',
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

      const uniqueValueInfos = await gen_uniqueValueInfos()
      const layerpoint = new GeoJSONLayer({
        id: 'pointlayer',
        title: 'Earthquakes from the last month',
        url: datageojson,
        copyright: 'USGS Earthquakes',
        field: 'status_work',
        featureReduction: clusterConfig,
        popupTemplate: {
          title: "{WorkName}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "WorkPermitNo",
                  label:'เลข Work Permit'
                },
                {
                  fieldName: "ExpiredDate",
                  label:'วันหมดอายุสภาพนั่งร้าน'
                },
                {
                  fieldName: "status_work",
                  label:'สถานะแจ้งเตือน'
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
          uniqueValueInfos

        },
      });
      // console.log('layerpoint', layerpoint)
      await stateMap?.remove(stateMap?.findLayerById('pointlayer'));
      stateMap?.add(layerpoint);
    }
  }

  const gen_uniqueValueInfos = async () => {
    try {
      const uniqueValueInfos = [];
      // debugger
      const scaffoldingIcon = [
        {
          name: "1",
          img: '/assets/iconmap/scaffolding/1.svg',
          detail: 'Light Duty'
        },
        {
          name: "2",
          img: '/assets/iconmap/scaffolding/2.svg',
          detail: 'Light Duty_Independent Tower'
        },
        {
          name: "3",
          img: '/assets/iconmap/scaffolding/3.svg',
          detail: 'Light Duty_Mobile'
        },
        {
          name: "4",
          img: '/assets/iconmap/scaffolding/4.svg',
          detail: 'Light Duty_Overhang'
        },
        {
          name: "5",
          img: '/assets/iconmap/scaffolding/5.svg',
          detail: 'Light Duty_Hanging'
        },
        {
          name: "6",
          img: '/assets/iconmap/scaffolding/6.svg',
          detail: 'Heavy Duty'
        },
        {
          name: "7",
          img: '/assets/iconmap/scaffolding/7.svg',
          detail: 'Heavy Duty_Independent Tower'
        },
        {
          name: "8",
          img: '/assets/iconmap/scaffolding/8.svg',
          detail: 'Heavy Duty_Mobile'
        },
        {
          name: "9",
          img: '/assets/iconmap/scaffolding/9.svg',
          detail: 'Heavy Duty_Overhang'
        },
        {
          name: "10",
          img: '/assets/iconmap/scaffolding/10.svg',
          detail: 'Heavy Duty_Hanging'
        },
        {
          name: "11",
          img: '/assets/iconmap/scaffolding/11.svg',
          detail: 'Heavy Duty_Internal'
        },
        {
          name: "12",
          img: '/assets/iconmap/scaffolding/12.svg',
          detail: 'Heavy Duty_Heavy Duty'
        },
        {
          name: "13",
          img: '/assets/iconmap/scaffolding/13.svg',
          detail: 'Confined Space'
        },
        {
          name: "14",
          img: '/assets/iconmap/scaffolding/14.svg',
          detail: 'Confined Space_Independent Tower'
        },
        {
          name: "15",
          img: '/assets/iconmap/scaffolding/15.svg',
          detail: 'Confined Space_Mobile'
        },
        {
          name: "16",
          img: '/assets/iconmap/scaffolding/16.svg',
          detail: 'Confined Space_Overhang'
        },
        {
          name: "17",
          img: '/assets/iconmap/scaffolding/17.svg',
          detail: 'Confined Space_Hanging'
        },
        {
          name: "18",
          img: '/assets/iconmap/scaffolding/18.svg',
          detail: 'Confined Space_Internal'
        },
        {
          name: "19",
          img: '/assets/iconmap/scaffolding/19.svg',
          detail: 'Confined Space_Heavy Duty'
        },
        {
          name: "20",
          img: '/assets/iconmap/scaffolding/20.svg',
          detail: 'Test Header 1'
        },
        {
          name: "21",
          img: '/assets/iconmap/scaffolding/21.svg',
          detail: 'Test Header Two'
        },
        {
          name: "22",
          img: '/assets/iconmap/scaffolding/22.svg',
          detail: 'Test Header Two_Sub Test Header Two'
        },
      ]

      const scaffoldingStatusWork = [
        {
          name: "near_expire",
          detail: "ใกล้หมดอายุ",
          img: '/assets/iconmap/status/warning-yellow.png'
        },
        {
          name: "expire",
          detail: "หมดอายุ",
          img: '/assets/iconmap/status/warning-red.png'
        },
        {
          name: "normal",
          detail: 'ปกติ',
          img: false,
        },
      ]
      var jsxsysmboleIcon = await Promise.all(scaffoldingIcon.map(async (item, index) => {
        return <div className='sysmbole_table' key={index.toString()}>
          <img src={item.img} alt="Avatar" className="avatar" />
          <span>{item.detail}</span>
        </div>
      }));
      var jsxsysmboleStatus = await Promise.all(scaffoldingStatusWork.map(async (item, index) => {
        return item.img && <div className='sysmbole_table' key={index.toString()}>
          <img src={item.img} alt="Avatar" className="avatar" />
          <span>{item.detail}</span>
        </div>
      }));

      setstateSysmbole([jsxsysmboleIcon, jsxsysmboleStatus]);

      for (const x in scaffoldingIcon) {
        if (Object.hasOwnProperty.call(scaffoldingIcon, x)) {
          const a = scaffoldingIcon[x];
          for (const y in scaffoldingStatusWork) {
            if (Object.hasOwnProperty.call(scaffoldingStatusWork, y)) {
              const b = scaffoldingStatusWork[y];
              uniqueValueInfos.push({
                value: `A${a.name}_${b.name}`,
                symbol: {
                  type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                  url: await CreateImgIcon(a.img, b.img),
                  width: '25px',
                  height: '25px',
                },
              })
            }
          }
        }
      }

      console.log("uniqueValueInfos", uniqueValueInfos)

      return uniqueValueInfos

    } catch (error) {
      // debugger
      console.log('error', error)
    }

  }




  const Status_cal = async (data) => {
    // console.log('data', data)


    const Status = {}
    if(data.all) Status["จำนวนจุด"] = { value: data.all, color: '#112345' };
    if(data.normal) Status["ปกติ"] = { value: data.normal, color: '#17d149' };
    if(data.near_expire) Status["ใกล้ Exp"] = { value: data.near_expire, color: '#F09234', img: '/assets/iconmap/status/warning-yellow.png' };
    if(data.expire) Status["หมด Exp"] = { value: data.expire, color: '#F54', img: '/assets/iconmap/status/warning-red.png' };
    dispatch(
      setStatus(Status),
    );

  };

  const Onload = async (map, view) => {
    const [Fullscreen, UI, Zoom, Expand, Extent, locator] = await loadModules([
      'esri/widgets/Fullscreen',
      'esri/views/ui/UI',
      'esri/widgets/Zoom',
      'esri/widgets/Expand',
      'esri/geometry/Extent',
      'esri/rest/locator',
    ]);
    const fullscreenui = new Fullscreen({
      view: view,
      element: document.querySelector("#pagediv"),
      id: 'fullscreenwiget'
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
    setStateMap(map);
    setStateView(view);

    // PTTlayer.ADDPTTWMSLAYER(map, view)
    // map.addMany(await PTTlayer.SHOW_AREALAYERNAME());



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

      // console.log('first', getScaffolding(model))
      setLayerpoint(await getScaffolding(model, true))

    } catch (error) {
      console.log('error', error)
    }
  }

  const onFinishFailed = (error) => {
    console.log('error', error)
  }


  const [form] = Form.useForm()

  const getScaffolding = async (item, openTableBool) => {
    let url = `/scaffolding/all?`;
    if (item.PTTStaffCode) url += `&PTTStaffCode=${item.PTTStaffCode}`;
    if (item.AgencyName) url += `&AgencyName=${item.AgencyName}`;
    if (item.StartDateTime) url += `&StartDateTime=${item.StartDateTime}`;
    if (item.EndDateTime) url += `&EndDateTime=${item.EndDateTime}`;
    if (item.AreaName) url += `&AreaName=${item.AreaName}`;
    if (isArray(item.ScaffoldingType)) {
      url += `&ScaffoldingType=${item.ScaffoldingType.toString()}`;
    }
    const { data } = await API.get(url);
    if (openTableBool) openTable()
    return data.Status === 'success' ? data.Message : {
      data: [],
      summary: {
        all: 0,
        expire: 0,
        near_expire: 0,
      }
    }
  }

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
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 16 }}
            name='nest-messages'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="PTTStaffCode"
              label='รหัสพนักงานผู้ควบคุมงาน'
            >
              <Select
                showArrow
                style={{ width: '100%' }}
                options={PTTStaffCode}
              />
            </Form.Item>

            <Form.Item
              name="AgencyName"
              label='หน่วยงานผู้ควบคุมงาน'
            >
              <Select
                showArrow
                style={{ width: '100%' }}
                options={AgencyName}
              />
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
              name="AreaName"
              label='สถานที่ปฏิบัติงาน'
            >
              <Select
                showArrow
                style={{ width: '100%' }}
                options={AreaName}
              />
            </Form.Item>

            <Form.Item
              name="ScaffoldingType"
              label='ประเภทนั่งร้าน'
            >
              <Select
                mode='multiple'
                showArrow
                style={{ width: '100%' }}
                options={ScaffoldingType}
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


        <div ref={refdetail} className='sysmbole esri-widget'>
          <Collapse accordion >
            <Panel header="ใช้สีแทนประเภทนั่งร้าน" key="1">
              {stateSysmbole ? stateSysmbole[0] : <>กำลังรอข้อมูล...</>}
            </Panel>
            <Panel header="ใช้สัญลักษณ์แทนการแจ้งเตือน" key="2">
              {stateSysmbole ? stateSysmbole[1] : <>กำลังรอข้อมูล...</>}
            </Panel>

          </Collapse>
        </div>

      </Map>


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
            <Row key={key}>
              <Col span={12}>
                <span style={{ color: "#0A8FDC" }}>{key}</span>
              </Col>
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
        rowKey={(d, index) => index.toString()}
        columns={columns2}
        dataSource={tabledata}
      />
    </div>
  );
};

export default ScaffoldingPage;
