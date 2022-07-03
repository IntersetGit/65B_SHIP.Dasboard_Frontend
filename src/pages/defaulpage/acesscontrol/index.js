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
  Collapse,
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
const { Panel } = Collapse;

const AcessControlPage = () => {
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);
  const refdrawn = useRef();
  const refdetail = useRef();
  const [tabledata, setTabledata] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [datamodal, setDatamodal] = useState(null);
  const dispatch = useDispatch();
  const Geojson = new WaGeojson();
  const demodata = new Demodata('access_control');
  const [stateSysmbole, setstateSysmbole] = useState(null);

  const [form] = Form.useForm()

  const columns = [
    {
      title: 'ชื่อ-สกุล ผู้รับเหมา',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'ประเภทบุคคล',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'ผู้ควบคุมงาน',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'พื้นที่สแกนล่าสุด',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'ประเภทบัตรที่แลก',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'สถานะการสแกนล่าสุด',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'วัน-เวลาสแกน',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'สถานะการแลคบัตร',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
      width: 150
    },
    {
      title: 'วัน-เวลาแลคบัตร',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text) => text ?? "-",
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
                  "เจ้าของพื้นที่": record.OwnerName ?? "-",
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
  const clusterConfig = {
    type: "cluster",
    clusterRadius: "40px",
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

  const getAcessControls = async (item, openTableBool) => {
    let url = `/accesscontrol/all?`;
    if (item.PTTStaffCode) url += `&PTTStaffCode=${item.PTTStaffCode}`;
    if (item.AgencyName) url += `&AgencyName=${item.AgencyName}`;
    if (item.Scan_Date_Time_Start) url += `&Scan_Date_Time_Start=${item.Scan_Date_Time_Start}`;
    if (item.Scan_Date_Time_End) url += `&Scan_Date_Time_End=${item.Scan_Date_Time_End}`;
    if (item.AccDeviceName) url += `&AccDeviceName=${item.AccDeviceName}`;
    if (isArray(item.PersonalTypeName)) {
      url += `&PersonalTypeName=${item.PersonalTypeName.toString()}`;
    }
    const { data } = await API.get(url);
    if (openTableBool) openTable();
    return data.Status === 'success' ? data.Message : {
      data: [],
      filter: {},
      summary: {}
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

    const resSf = await getAcessControls({});
    setLayerpoint(resSf)
    socket.on("accesscontrol", (res) => {
      // console.log('socket', res)
      if (res.Status == "success") {
        setLayerpoint(res.Message)
      }
    });
    socket.on("accesscontroldevice", (res) => {
      // console.log('socket', res)
      if (res.Status == "success") {
        setLayerpoint(res.Message)
      }
    });


  }


  const [AccDeviceNameOptions, setAccDeviceNameOptions] = useState([]);
  const [AgencyNameOptions, setAgencyNameOptions] = useState([]);
  const [PersonalTypeNameOptions, setPersonalTypeNameOptions] = useState([]);
  const [PTTStaffCodeOptions, setPTTStaffCodeOptions] = useState([]);

  const setLayerpoint = async (item) => {
    try {
      console.log('stateView', stateView)
      if (stateView) {

        Status_cal(item.summary);

        if (isPlainObject(item.filter)) {
          if (isArray(item.filter.AccDeviceName)) setAccDeviceNameOptions(item.filter.AccDeviceName.map(e => {
            return {
              id: e.AccDeviceID,
              value: e.AccDeviceName
            }
          }))
          if (isArray(item.filter.AgencyName)) setAgencyNameOptions(item.filter.AgencyName.map(e => { return { value: e.AgencyName } }))
          if (isArray(item.filter.PTTStaffCode)) setPTTStaffCodeOptions(item.filter.PTTStaffCode.map(e => { return { value: e.PTTStaffCode } }))
          if (isArray(item.filter.PersonalTypeName)) setPersonalTypeNameOptions(item.filter.PersonalTypeName.map(e => {
            return {
              id: e.PersonalTypeID,
              value: e.PersonalTypeName
            }
          }))
        }

        // let GetAllArea = await PTTlayer.SHOW_AREALAYERNAME();
        let GetAllArea = null;
        let latlng = []
        // console.log('item', item)
        let workpermit_type = await (await gen_uniqueValueInfos()).scaffoldingIcon;
        let maplatlng_type = workpermit_type.reduce((a, v) => ({ ...a, [v.name]: demodata.getRandomLocation(12.719, 101.147, 60) }), {});

        console.log('item.data', item.data)

        const filter_show_in_map = item.data.filter(where => where.others.show_in_map);
        console.log('filter_show_in_map', filter_show_in_map)
        for (const opp in filter_show_in_map) {
          const obj = item.data[opp];

          let findeArea = GetAllArea?.find(async (area) => {
            let feature = await area.queryFeatures();
            if (feature.features[0].attributes.UNITNAME == (obj.AreaName).replace(/#/i, '')) {
              return area;
            }
          });
          let getextentcenter = await findeArea?.queryExtent();
          var randomlatlng = demodata.getRandomLocation(getextentcenter?.extent?.center?.latitude ?? 12.719, getextentcenter?.extent?.center?.longitude ?? 101.147, 0)
          let getlatlng = maplatlng_type[obj.WorkpermitTypeID];

          console.log('getlatlng', getlatlng)

          /* error ไม่มี notification */
          // let checkstatus = Object.keys(obj.notification); /// 
          // let isstatus = checkstatus.filter((s) => obj.notification[s] == true)
          // // console.log('isstatus', isstatus)


          // if (isPlainObject(obj.notification)) {
          //   const arr = [];
          //   if (obj.notification.near_expire) arr.push("⚠️ ใกล้ Exp");
          //   if (obj.notification.expire) arr.push("‼️ หมด Exp");
          //   if (obj.notification.gas) arr.push("ก๊าซที่ต้องตรวจวัด");
          //   if (obj.notification.impairment) arr.push("Impairment");
          //   obj.notification.list = arr;
          // }


          latlng.push({
            ...obj,
            "id": obj._id,
            "work_number": obj.WorkPermitNo,
            "name": obj.Name,
            "licensor": obj.PTTStaff,
            "supervisor": obj.OwnerName,
            "date_time_start": moment(new Date(obj.others.WorkingStart)).format("DD/MM/YYYY hh:mm:ss"),
            "date_time_end": moment(new Date(obj.others.WorkingEnd)).format("DD/MM/YYYY hh:mm:ss"),
            // "status_work": `${obj.WorkpermitTypeID}_${obj.WorkPermitStatusID}${isArray(obj.notification.list) && obj.notification.list.length > 1 ? '_warning_all' : '_' + isstatus[0]}`,
            // "latitude": randomlatlng?.latitude ?? null,
            // "longitude": randomlatlng?.longitude ?? null,
            ...demodata.getRandomLocation(getlatlng.latitude, getlatlng.longitude, 3),
            "locatoin": obj.SubAreaName,
            "work_type": obj.WorkpermitType,
          })

          //})
        }


        console.log('latlng =>>>>>>>>>>>>>', latlng)
        setTabledata(latlng);

        let datageojson = await Geojson.CleateGeojson(latlng, 'Point');
        console.log('datageojson', datageojson)
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
                    fieldName: "notification",
                    label: "แจ้งเตือน"
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
            uniqueValueInfos: await (await gen_uniqueValueInfos(item.filter.WorkpermitTypeID, item.filter.WorkPermitStatusID)).uniqueValueInfos


          },
        });
        await stateMap?.remove(stateMap?.findLayerById('pointlayer'));
        stateMap?.add(layerpoint);
        // let maplayerSerch = stateMap?.findLayerById('pointlayer');
        // console.log('maplayerSerch :>> ', maplayerSerch);
        // if (maplayerSerch) {
        //   console.log('yes')
        //   maplayerSerch.url = "blob:http://localhost:3000/9d390f7f-65a7-4d22-90e6-3776e07371d3";
        //   maplayerSerch.refresh();
        // } else {
        //   stateMap?.add(layerpoint);
        // }

      }
    } catch (error) {
      console.log('error', error)
    }

  }

  const gen_uniqueValueInfos = async (type, status) => {
    const uniqueValueInfos = [];

    const scaffoldingIcon = [
      {
        name: "SF",
        color: "rgba(106, 61, 154)",
        img: await CreateIcon("rgba(106, 61, 154)", false),
        detail: 'ใบอนุญาติติดตั้ง/รื้อถอนนั่งร้าน'
      },
      {
        name: "CD",
        color: "rgba(251, 154, 153)",
        img: await CreateIcon("rgba(251, 154, 153)", false),
        detail: 'ใบอนุญาติทำงานธรรมดา'
      },
      {
        name: "EL",
        color: "rgba(11, 154, 153)",
        img: await CreateIcon("rgba(11, 154, 153)", false),
        detail: 'ใบอนุญาติทำงานไฟฟ้่า/ระบบควบคุม'
      },
      {
        name: "EV",
        color: "rgba(123, 154, 153)",
        img: await CreateIcon("rgba(123, 154, 153)", false),
        detail: 'ใบอนุญาติทำงานที่อับอากาศ'
      },
      {
        name: "EX",
        color: "rgba(12, 32, 153)",
        img: await CreateIcon("rgba(12, 32, 153)", false),
        detail: 'ใบอนุญาติทำงานขุดเจาะ'
      },
      {
        name: "HT1",
        color: "rgba(255, 127, 0)",
        img: await CreateIcon("rgba(255, 127, 0)", false),
        detail: 'ใบอนุญาติที่มีความร้อนประกายไฟ-I'
      },
      {
        name: "HT2",
        color: "rgba(255, 12, 0)",
        img: await CreateIcon("rgba(255, 12, 0)", false),
        detail: 'ใบอนุญาติที่มีความร้อนประกายไฟ-II'
      },
      {
        name: "MC",
        color: "rgba(51, 160, 44)",
        img: await CreateIcon("rgba(51, 160, 44)", false),
        detail: 'ใบอนุญาติใช้งานรถเครนชนิดเคลื่อนที่/รถเฮียบ'
      },
      {
        name: "RD",
        color: "rgba(122, 160, 44)",
        img: await CreateIcon("rgba(122, 160, 44)", false),
        detail: 'ใบอนุญาติทำงานรังสี'
      },
    ]

    const open_close = [
      {
        name: "open",
        color: "rgba(233, 211, 333)",
        img: await CreateIcon("rgba(233, 211, 333)", false, 1),
        detail: 'ใบงานเปิด'
      },
      {
        name: "close",
        color: "rgba(233, 211, 333)",
        img: await CreateIcon("rgba(233, 211, 333)", false, 2),
        detail: 'ใบงานปิด'
      }
    ]

    const open = ['W02', 'W03', 'W04', 'W07', 'W08', 'W09', 'W11', 'W12', 'W13', 'W15', 'W18', 'W19']
    const close = ['W05', 'W06', 'W10']

    const scaffoldingStatusWork = [
      {
        name: "gas",
        detail: "แจ้งเตือนการตรวจวัดก๊าซ",
        img: '/assets/iconmap/status/warning-yellow.png',
      },
      {
        name: "impairment",
        detail: "อุปกรณ์ Impairment",
        img: '/assets/iconmap/status/warning-red.png',
      },
      {
        name: "",
        detail: 'ปกติ',
        img: false,
      },
      {
        name: "near_expire",
        detail: "แจ้งเตือนใกล้หมดอายุ",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/2048px-Antu_dialog-warning.svg.png"
      },
      {
        name: "expire",
        detail: "แจ้งเตือนหมดอายุ",
        img: "https://cdn-icons-png.flaticon.com/512/564/564619.png"
      },
      {
        name: "warning_all",
        detail: "แจ้งเตือนมากกว่า 1 รายการ",
        img: '/assets/iconmap/status/warning-all.png'
      },
    ]
    if (status || type) {
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
      var jsxsysmboleType = await Promise.all(open_close.map(async (item, index) => {
        return item.img && <div className='sysmbole_table' key={index.toString()}>
          <img src={item.img} alt="Avatar" className="avatar" />
          <span>{item.detail}</span>
        </div>
      }));

      setstateSysmbole([jsxsysmboleIcon, jsxsysmboleStatus, jsxsysmboleType]);

      for (const x in scaffoldingIcon) {
        if (Object.hasOwnProperty.call(scaffoldingIcon, x)) {
          const a = scaffoldingIcon[x];
          for (const y in scaffoldingStatusWork) {
            if (Object.hasOwnProperty.call(scaffoldingStatusWork, y)) {
              const b = scaffoldingStatusWork[y];
              for (const s in status) {
                let typedraw;
                if (open.some(i => i == status[s].Status_ID)) {
                  typedraw = 1
                } else if (close.some(i => i == status[s].Status_ID)) {
                  typedraw = 2
                } else {
                  typedraw = 1
                }
                uniqueValueInfos.push({
                  value: `${a.name}_${status[s].Status_ID}${b.name !== '' ? '_' + b.name : ''}`,
                  symbol: {
                    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                    url: await CreateIcon(a.color, b.img, typedraw),
                    width: '25px',
                    height: '25px',
                  },
                })
              }
            }
          }
        }
      }

      // console.log("uniqueValueInfos", uniqueValueInfos)
    }
    return {
      scaffoldingIcon,
      scaffoldingStatusWork,
      uniqueValueInfos
    }

  }



  const Status_cal = async (data) => {

    // console.log('data', data)
    dispatch(
      setStatus({
        "จำนวนจุด": { value: data.all, color: '#112345' },
        "ปกติ": { value: data.normal, color: '#F54' },
        "ใกล้ Exp": { value: data.near_expire, color: '#F09234' },
        "หมด Exp": { value: data.expire, color: '#F88' },
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

      // console.log('first', getAcessControls(model))
      setLayerpoint(await getAcessControls(model, true))

    } catch (error) {
      console.log('error', error)
    }
  }

  const onFinishFailed = (error) => {
    console.log('error', error)
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
                options={PTTStaffCodeOptions}
              />
            </Form.Item>

            <Form.Item
              name="AgencyName"
              label='หน่วยงานผู้ควบคุมงาน'
            >
              <Select
                showArrow
                style={{ width: '100%' }}
                options={AgencyNameOptions}
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
              name="AccDeviceName"
              label='อุปกรณ์ Access Control'
            >
              <Select
                showArrow
                style={{ width: '100%' }}
              >
                {AccDeviceNameOptions.map((e) => <Select.Option key={e.id}>{`${e.id}-${e.value}`}</Select.Option>)}
              </Select>
            </Form.Item>

            <Form.Item
              name="PersonalTypeName"
              label='ประเภทกลุ่มบุคคล'
            >
              <Select
                mode='multiple'
                showArrow
                style={{ width: '100%' }}
              >
                {PersonalTypeNameOptions.map((e) => <Select.Option key={e.id}>{`${e.id}-${e.value}`}</Select.Option>)}
              </Select>
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
            <Panel header="ใช้สีแทนประเภทใบงาน" key="1">
              {stateSysmbole ? stateSysmbole[0] : <>กำลังรอข้อมูล...</>}
            </Panel>
            {stateSysmbole && stateSysmbole[2] && <Panel header="ใช้สัญลักษณ์แทนการเปิด-ปิด" key="3">
              {stateSysmbole ? stateSysmbole[2] : <>กำลังรอข้อมูล...</>}
            </Panel>}
            <Panel header="ใช้สัญลักษณ์แทนการแจ้งเตือน" key="2">
              {stateSysmbole ? stateSysmbole[1] : <>กำลังรอข้อมูล...</>}
            </Panel>

          </Collapse>
          {/* <div id="legendDiv"></div> */}

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
