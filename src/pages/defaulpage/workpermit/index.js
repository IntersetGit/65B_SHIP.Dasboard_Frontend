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
  DatePicker,
  Divider
} from 'antd';
import {
  SearchOutlined,
  ExpandOutlined
} from '@ant-design/icons';
import { Map, WebScene } from '@esri/react-arcgis';
import { loadModules } from 'esri-loader';
import './index.style.less';
import socketClient from '../../../util/socket';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../../redux/actions';
import moment, { isMoment } from 'moment';
import Demodata from '../../demodata';
import WaGeojson from '../../../util/WaGeojson';
import { CreateIcon, CreateImgIcon } from '../../../util/dynamic-icon'
import API from '../../../util/Api'
import { isArray, isNumber, isPlainObject } from 'lodash';
import PTTlayers from '../../../util/PTTlayer'
import { circle } from '@turf/turf';
import { Helmet } from 'react-helmet';

const { Panel } = Collapse;
const { Option } = Select;


const WorkpermitPage = () => {
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);
  const refdrawn = useRef();
  const refdetail = useRef();
  const refgismap = useRef();
  const [tabledata, setTabledata] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [datamodal, setDatamodal] = useState(null);
  const dispatch = useDispatch();
  const demodata = new Demodata('workpermit');
  const Geojson = new WaGeojson();
  const PTTlayer = new PTTlayers();
  const [stateSysmbole, setstateSysmbole] = useState(null);
  const [selectArea, setselectArea] = useState([]);
  const columns = [
    {
      title: 'เลข work',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      align: "center",
      width: 150
    },
    {
      title: 'ชื่อ - สกุล ผู้รับเหมา',
      dataIndex: 'Name',
      key: 'Name',
      width: 150
    },
    {
      title: 'ผู้อนุญาต/เจ้าของพื้นที่',
      dataIndex: 'OwnerName',
      key: 'OwnerName',
      width: 150
    },
    {
      title: 'ผู้ควบคุมงาน',
      dataIndex: 'PTTStaffName',
      key: 'PTTStaffName',
      width: 150
    },
    {
      title: 'ประเภทงาน',
      key: 'WorkType',
      dataIndex: 'WorkType',
      width: 150
    },
    {
      title: 'สถานที่ปฏิบัติงาน',
      key: 'Location',
      dataIndex: 'Location',
      align: "center",
      width: 150
    },
    {
      title: 'วัน-เวลา เริ่มต้นของใบงาน',
      dataIndex: 'date_time_start',
      key: 'date_time_start',
      width: 200
    },
    {
      title: 'วัน-เวลา สิ้นสุดของใบงาน',
      dataIndex: 'date_time_end',
      key: 'date_time_end',
      width: 200
    },
    {
      title: 'สถานะ work',
      dataIndex: 'others',
      key: 'others',
      width: 150,
      align: "center",
      render: (text, record) => text.WorksheetStatusId
    },
    {
      title: 'สถานะแจ้งเตือน',
      dataIndex: 'notification',
      key: 'notification',
      width: 150,
      render: (text, record) => isArray(text.list) ? text.list.length > 1 ? (
        <>
          <img src='/assets/iconmap/status/warning-all.png' width={15} /> {text.list.toString()}
        </>
      ) : text.list.toString() : "-"
    },
    {
      title: '...',
      key: '',
      width: 150,
      align: "center",
      render: (text, record) => {
        return (
          <Space size='middle'>
            <Button
              type='primary'
              onClick={() => {
                setDatamodal({
                  "ชื่อ-สกุล": record.Name,
                  "เลขบัตรประชาชน": record.IDCard,
                  "เลข Work Permit": record.WorkPermitNo,
                  "รหัสประเภทของ work": record.WorkTypeID,
                  "ประเภทของ work": record.WorkType,
                  "รายละเอียดของงาน": record.Description,
                  "ชื่อสถานที่ปฏิบัติงานหลัก": record.Location,
                  "ชื่อสถานที่ปฏิบัติงานย่อย": record.SubLocation,
                  "วันที่เริ่มต้นของใบงาน": record.WorkStartDate,
                  "วันที่สิ้นสุดของใบงาน": record.WorkEndDate,
                  "เวลาเริ่มต้นของใบงาน": record.WorkStartTime,
                  "เวลาสิ้นสุดของใบงาน": record.WorkEndTime,
                  "รหัสบริษัท": record.CompanyCode,
                  "ชื่อบริษัท": record.CompanyName,
                  "รหัสผู้ควบคุมงาน": record.PTTStaffID,
                  "ชื่อผู้ควบคุมงาน": record.PTTStaffName,
                  "รหัสหน่วยงานผู้ควบคุม": record.AgencyID,
                  "ชื่อหน่วยงานผู้ควบคุม": record.SupervisorAgencyName,
                  "รหัสผู้อนุญาต/เจ้าของพื้นที่": record.OwnerID,
                  "ชื่อผู้อนุญาต/เจ้าของพื้นที่": record.OwnerName,
                  "รหัสสถานะใบงาน": record.WorksheetStatusId,
                  "สถานะใบงาน": record.others.WorksheetStatusId,
                  "เวลาการตรวจวัดก๊าซล่าสุด": record.GasMeasurement,
                  "อุปกรณ์ที่ Impairment": record.impairmentName,
                  "สถานะแจ้งเตือน": isArray(record.notification.list) ? record.notification.list.length > 1 ? record.notification.list.toString() : record.notification.list.toString() : "-"
                }),
                  setIsModalVisible(!isModalVisible);
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
    clusterRadius: "30px",
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
  const [loading, setloading] = useState(false);
  const getWorkpermit = async (item, openTableBool) => {
    try {
      setloading(true);
      let url = `/workpermit/all?`;
      if (item.SupervisorId) url += `&SupervisorId=${item.SupervisorId}`;
      if (item.SupervisorAgencyName) url += `&SupervisorAgencyName=${item.SupervisorAgencyName}`;
      if (item.Location) {
        const Location = (item.Location).replace(/#/i, '%23')
        url += `&Location=${Location}`;
      };
      if (item.StartDateTime) url += `&StartDateTime=${item.StartDateTime}`;
      if (item.EndDateTime) url += `&EndDateTime=${item.EndDateTime}`;
      if (isArray(item.WorksheetStatusId)) {
        url += `&WorksheetStatusId=${item.WorksheetStatusId.toString()}`;
      }
      // GSP%231%20Utility
      // GSP%231%20Utility
      if (isArray(item.WorkTypeID)) {
        url += `&WorkTypeID=${item.WorkTypeID.toString()}`;
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
    (async () => {
      let area = await PTTlayer.GETMASTER_AREA_LAYERGIS();
      setselectArea(area);

    })();
  }, []);

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
    // console.log('resSf :>> ', resSf);
    socket.on("workpermit", async (res) => {
      const resSf = await getWorkpermit(form.getFieldValue());
      setLayerpoint(resSf)
    });


  }

  const [AgencyIDOptions, setAgencyIDOptions] = useState([]);
  const [AgencyNameOptions, setAgencyNameOptions] = useState([]);
  const [AreaNameOptions, setAreaNameOptions] = useState([]);
  const [PTTStaffIDOptions, setPTTStaffIDOptions] = useState([]);
  const [WorkPermitStatusIDOptions, setWorkPermitStatusIDOptions] = useState([]);
  const [WorkTypeIDOptions, setWorkTypeIDOptions] = useState([]);

  const setLayerpoint = async (item) => {
    try {
      if (stateView) {

        Status_cal(item?.summary);

        if (isPlainObject(item?.filter)) {
          if (isArray(item.filter.SupervisorAgencyID)) setAgencyIDOptions(item.filter.SupervisorAgencyID.map(e => { return { value: e.SupervisorAgencyID } }))
          if (isArray(item.filter.SupervisorAgencyName)) setAgencyNameOptions(item.filter.SupervisorAgencyName.map(e => { return { value: e.SupervisorAgencyName } }))
          if (isArray(item.filter.Location)) setAreaNameOptions(item.filter.Location.map(e => { return { value: e.Location } }))
          if (isArray(item.filter.SupervisorId)) setPTTStaffIDOptions(item.filter.SupervisorId.map(e => { return { value: e.SupervisorId } }))
          if (isArray(item.filter.WorksheetStatusId)) setWorkPermitStatusIDOptions(item.filter.WorksheetStatusId.map(e => {
            return {
              id: e.WorksheetStatusId,
              value: e.Status_Desc
            }
          }))
          if (isArray(item.filter.WorkTypeID)) setWorkTypeIDOptions(item.filter.WorkTypeID.map(e => {
            return {
              id: e.WorkTypeID,
              value: e.WP_Type_Name
            }
          }))
        }
        let GetAllArea = await PTTlayer.SHOW_AREALAYERNAME();
        var Arealatlng = await Promise.all(GetAllArea.map(async (area, index) => {
          let extent = await area?.queryExtent();
          // let test = await PTTlayer.RandomInArea(extent.extent);
          // console.log('test', test)

          let feature = await area.queryFeatures();
          let namearea = feature?.features[0]?.attributes?.UNITNAME;
          let workpermit_type = await (await gen_uniqueValueInfos()).scaffoldingIcon;
          let maplatlng_type = workpermit_type.reduce((a, v) => ({ ...a, [v.name]: demodata.getRandomLocation(extent?.extent?.center?.latitude, extent?.extent?.center?.longitude, 60) }), {})
          return {
            name: namearea,
            center: extent?.extent?.center,
            typelatlng: maplatlng_type
          }
        }));

        // console.log('Arealatlng', Arealatlng)
        // let GetAllArea = null;
        let latlng = []
        console.log('item.data', item.data)

        for (const opp in item.data) {
          const obj = item.data[opp];
          // let findeArea = Arealatlng?.find((area) => {
          //   if (area.name == (obj.AreaName).replace(/#/i, '')) {
          //     let latlng_type = area.typelatlng[obj.WorkpermitTypeID];
          //     // console.log('latlng_type', latlng_type)
          //     return area
          //   } else {
          //     return {
          //       name: "defaul",
          //       center: {
          //         latitude: 12.719,
          //         longitude: 101.147
          //       },
          //       typelatlng: area.typelatlng
          //     }
          //   }
          // });
          let findeArea = Arealatlng?.find((area) => (area.name).replace(/#/i, '') == (obj.Location).replace(/#/i, ''))
          if (!findeArea) findeArea = Arealatlng[0]
          let getlatlng_byarea = findeArea.typelatlng[obj.WorkTypeID];
          // console.log('getlatlng_byarea :>> ', getlatlng_byarea);

          let checkstatus = Object.keys(obj.notification);
          let isstatus = checkstatus.filter((s) => obj.notification[s] == true)
          // console.log('isstatus', isstatus)


          if (isPlainObject(obj.notification)) {
            const arr = [];
            const arr2 = [];
            if (obj.notification.near_expire) arr2.push("near_expire");
            if (obj.notification.expire) arr2.push("expire");
            if (obj.notification.gas) arr2.push("gas");
            if (obj.notification.impairment) arr2.push("impairment");

            if ((obj.notification.near_expire === true)) arr.push(" ใกล้ Exp.");
            if ((obj.notification.expire === true)) arr.push(" Exp.");
            if ((obj.notification.gas === true)) arr.push(" ก๊าซที่ต้องตรวจวัด");
            if ((obj.notification.impairment === true)) arr.push(" Impairment");
            obj.notification.list = arr;
            obj.notification.list2 = arr2;
          }

          obj.Name = `${obj.Titlename} ${obj.Firstname} ${obj.Lastname}`
          obj.PTTStaffName = `${obj.SupervisorTitle} ${obj.SupervisorFName} ${obj.SupervisorLName}`
          latlng.push({
            ...obj,
            "id": obj._id,
            "work_number": obj.WorkPermitNo,
            "name": `${obj.Name}`,
            "licensor": obj.PTTStaff,
            "supervisor": obj.OwnerName,
            "date_time_start": moment(new Date(obj.others.WorkingStart)).format("DD/MM/YYYY hh:mm:ss"),
            "date_time_end": moment(new Date(obj.others.WorkingEnd)).format("DD/MM/YYYY hh:mm:ss"),
            // "status_work": `${obj.WorkTypeID}_${obj.WorksheetStatusId}${obj.GasMeasurement ? '_Gas' : ''}`,
            // "status_work": `${obj.WorkTypeID}_${obj.WorksheetStatusId}${isstatus && isstatus.length > 2 ? '_warning_all' : '_' + isstatus[0]}`,
            "status_work": `${obj.WorkTypeID}_${obj.WorksheetStatusId}${isArray(obj.notification.list2) && obj.notification.list2.length > 1 ? '_warning_all' : '_' + isstatus[0]}`,
            // "latitude": randomlatlng?.latitude ?? null,
            // "longitude": randomlatlng?.longitude ?? null,
            ...demodata.getRandomLocation(getlatlng_byarea.latitude, getlatlng_byarea.longitude, 3),
            "locatoin": obj.SubLocation,
            "work_type": obj.WorkType,
            "warning": obj.notification.list.toString()
          })

          //})
        }


        // console.log('latlng =>>>>>>>>>>>>>', latlng)
        setTabledata(latlng);

        let datageojson = await Geojson.CleateGeojson(latlng, 'Point');
        console.log('datageojson', datageojson)
        setTabledata(latlng);
        const [FeatureLayer, GeoJSONLayer, reactiveUtils] = await loadModules([
          'esri/layers/FeatureLayer',
          'esri/layers/GeoJSONLayer',
          "esri/core/reactiveUtils",
        ]);
        let layerView;
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
                    fieldName: "WorksheetStatus",
                    label: "สถานะใบงาน"
                  },
                  {
                    fieldName: "warning",
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
            uniqueValueInfos: await (await gen_uniqueValueInfos(item.filter.WorkTypeID, item.filter.WorksheetStatusId)).uniqueValueInfos


          },
        });
        // layerpoint
        //   .when()
        //   .then(clusterConfig)
        //   .then(async (featureReduction) => {
        //     //console.log('featureReduction :>> ', featureReduction);
        //     // layerpoint.featureReduction = featureReduction;
        //     // layerView = await stateView?.whenLayerView(layerpoint);

        //     reactiveUtils.watch(
        //       () => stateView?.scale,
        //       (scale) => {
        //         layerpoint.featureReduction  =
        //         scale > 80 ? clusterConfig : null;
        //         // console.log('scale :>> ', scale);
        //       }
        //     );
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
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
        color: "#228B22",
        img: await CreateIcon("#228B22", false),
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
        color: "#93FFE8",
        img: await CreateIcon("#93FFE8", false),
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
        color: "#EE9A4D",
        img: await CreateIcon("#EE9A4D", false),
        detail: 'ใบอนุญาติที่มีความร้อนประกายไฟ-I'
      },
      {
        name: "HT2",
        color: "#A70D2A",
        img: await CreateIcon("#A70D2A", false),
        detail: 'ใบอนุญาติที่มีความร้อนประกายไฟ-II'
      },
      {
        name: "MC",
        color: "#9D00FF",
        img: await CreateIcon("#9D00FF", false),
        detail: 'ใบอนุญาติใช้งานรถเครนชนิดเคลื่อนที่/รถเฮียบ'
      },
      {
        name: "RD",
        color: "#F778A1",
        img: await CreateIcon("#F778A1", false),
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
        img: "/assets/iconmap/status/warning-yellow-2.png"
      },
      {
        name: "expire",
        detail: "แจ้งเตือนหมดอายุ",
        img: "/assets/iconmap/status/warning-red-2.png"
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

    const Status = {}
    if (data.total !== undefined) Status["ใบงานทั้งหมด"] = { value: data.total, color: '#112345' };
    if (data.open !== undefined) Status["Open"] = { value: data.open, color: '#17d149' };
    if (data.close !== undefined) Status["Close"] = { value: data.close, color: '#F09234', };
    if (data.near_expire !== undefined) Status["ใกล้ Exp."] = { value: data.near_expire, color: '#F54', img: "/assets/iconmap/status/warning-yellow-2.png" };
    if (data.expire !== undefined) Status["Exp."] = { value: data.expire, color: '#F89', img: "/assets/iconmap/status/warning-red-2.png" };
    if (data.gas !== undefined) Status["ก๊าซที่ต้องตรวจวัด"] = { value: data.gas, color: '#F024', img: '/assets/iconmap/status/warning-yellow.png' };
    if (data.impairment !== undefined) Status["Impairment"] = { value: data.impairment, color: '#548', img: '/assets/iconmap/status/warning-red.png' };
    dispatch(
      setStatus(Status),
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
    view.ui.add(
      new Expand({
        view,
        content: refgismap.current,
        expandIconClass: "esri-icon-layer-list",
        expanded: false,
      }),
      "top-left"
    );
    // view.watch('zoom', zoomChanged);
    // function zoomChanged(newValue, oldValue, property, object) {
    //   let maplayerCLuster = map.findLayerById('pointlayer');
    //   if (newValue >= 20) {
    //     if (maplayerCLuster) {
    //       let fr = maplayerCLuster.featureReduction;
    //       maplayerCLuster.featureReduction =
    //         fr && fr.type === "cluster" && null;
    //     }
    //   } else if (newValue <= 20) {
    //     if (maplayerCLuster) {
    //       let fr = maplayerCLuster.featureReduction;
    //       maplayerCLuster.featureReduction =
    //         fr && fr.type === null ? clusterConfig : clusterConfig;
    //     }
    //     // console.log("New value: ", newValue,
    //     //   "<br>Old value: ", oldValue,
    //     //   "<br>Watched property: ", property,
    //     //   "<br>Watched object: ", object);
    //   }
    // }



    setStateMap(map);
    setStateView(view);
    PTTlayer.CLICK_SHOWLATLONG(view);
    PTTlayer.ADDPTTWMSLAYER(map, view)
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
      const resSf = await getWorkpermit(model);
      setLayerpoint(resSf)

    } catch (error) {
      console.log('error', error)
    }
  }

  const onFinishFailed = (error) => {
    console.log('error', error)
  }


  const [form] = Form.useForm()

  const openTable = () => {
    document.querySelector('.ant-table-wrapper').style.setProperty('display', 'block', 'important');
  }

  const closeTable = () => {
    document.querySelector('.ant-table-wrapper').style.setProperty('display', 'none', 'important');
  }

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
  return (
    <>
      <Helmet>
        <title>Workpermit | DashBoard</title>
      </Helmet>
      <div id="pagediv">
        <div id='zoom-select'>
          <ExpandOutlined />
        </div>

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

          <div ref={refgismap} id="infoDiv" style={{ width: '200px', height: '100%', padding: "10px" }} className="esri-widget">
            สถานที่ใช้งาน
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
              >
                {/* {selectArea.length > 0 && selectArea.find((i)=>{
                if(i.LAYERNAME == "PLANT"){
                  i?.RESULT?.map((item,index)=>(
                    <Option key={index} value="jack">Jack</Option>
                  ))
                }
              })} */}
                {OptionSelectArea("PLANT")}
              </Select>
              <Button size="small" icon={<SearchOutlined />}></Button>
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
              >
                {OptionSelectArea("AREA")}
              </Select>
              <Button size="small" icon={<SearchOutlined />}></Button>
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
              >
                {OptionSelectArea("BUILDING")}
              </Select>
              <Button size="small" icon={<SearchOutlined />}></Button>
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
              >
                {OptionSelectArea("EQUIPMENT")}
              </Select>
              <Button size="small" icon={<SearchOutlined />}></Button>
            </Space>


          </div>
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
                name="SupervisorId"
                label='รหัสพนักงานผู้ควบคุมงาน'
              >
                <Select
                  showArrow
                  loading={loading}
                  style={{ width: '100%' }}
                  options={PTTStaffIDOptions}
                />
              </Form.Item>

              {/* <Form.Item
              name="SupervisorAgencyID"
              label='รหัสหน่วยงานผู้ควบคุม'
            >
              <Select
                loading={loading}
                showArrow
                style={{ width: '100%' }}
                options={AgencyIDOptions}
              />
            </Form.Item> */}

              <Form.Item
                name="SupervisorAgencyName"
                label='หน่วยงานผู้ควบคุม'
              >
                <Select
                  loading={loading}
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
                name="Location"
                label='สถานที่ปฎิบัติงาน'
              >
                <Select
                  loading={loading}
                  showArrow
                  style={{ width: '100%' }}
                  options={AreaNameOptions}
                />
              </Form.Item>


              <Form.Item
                name="WorksheetStatusId"
                label='สถานะ Work'
              >
                <Select
                  loading={loading}
                  mode='multiple'
                  showArrow
                  style={{ width: '100%' }}

                >
                  {WorkPermitStatusIDOptions.map((e) => <Select.Option key={e.id}>{`${e.id}-${e.value}`}</Select.Option>)}

                </Select>
              </Form.Item>

              <Form.Item
                name="WorkTypeID"
                label='ประเภทใบอนุญาต'
              >
                <Select
                  loading={loading}
                  mode='multiple'
                  showArrow
                  style={{ width: '100%' }}
                >
                  {WorkTypeIDOptions.map((e) => <Select.Option key={e.id}>{`${e.id}-${e.value}`}</Select.Option>)}
                </Select>

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
              !(typeof value == 'object') &&
              <Row key={key}>
                <Col span={12}>
                  <span style={{ color: "#0A8FDC" }}>{key}</span>
                </Col>
                <Col span={12}>{value ?? "-"}</Col>
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
          onRow={(record, rowIndex) => {
            return {
              onClick: async () => {
                const [GeoJSONLayer] = await loadModules([
                  'esri/layers/GeoJSONLayer',
                ]);
                let cicle = circle([record.longitude, record.latitude], 0.001);
                const blob = new Blob([JSON.stringify(cicle)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const geojsonlayer = new GeoJSONLayer({
                  url: url,
                  copyright: "PTT POINTGENARATE"
                });
                let extent = await geojsonlayer.queryExtent();
                stateView?.goTo(extent.extent)
                let animation = document.querySelector('#zoom-select');
                animation.style.setProperty('display', 'block', 'important');
                setTimeout(() => {
                  animation.style.setProperty('display', 'none', 'important');
                }, 3000)

              }, // click row
            };
          }}
          rowKey={(i) => i.id}
          columns={columns}
          dataSource={tabledata}
        />
      </div>
    </>

  )
}
export default WorkpermitPage;
