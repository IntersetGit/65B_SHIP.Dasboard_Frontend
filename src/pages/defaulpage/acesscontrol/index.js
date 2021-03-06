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
import { isArray, isNumber, isPlainObject } from 'lodash';
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
  const PTTlayer = new PTTlayers();

  const [form] = Form.useForm()

  const columns = [
    {
      title: 'ชื่อ-สกุล ผู้รับเหมา',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text, obj) => (obj.TitleName ?? "-") + " " + (obj.FirstName ?? "-") + " " + (obj.LastName ?? ""),
      width: 150
    },
    {
      title: 'ประเภทบุคคล',
      dataIndex: 'PersonalTypeName',
      key: 'PersonalTypeName',
      render: (text) => text ? text.PersonalTypeName : "-",
      width: 150
    },
    {
      title: 'ผู้ควบคุมงาน',
      dataIndex: 'WorkPermitNo',
      key: 'WorkPermitNo',
      render: (text, obj) => (obj.PTTStaff_FName ?? "-") + " " + (obj.PTTStaff_LName ?? ""),
      width: 200
    },
    {
      title: 'พื้นที่สแกนล่าสุด',
      dataIndex: 'AccDevice',
      key: 'AccDevice',
      render: (text) => text ? text.AreaName : "-",
      width: 150
    },
    {
      title: 'ประเภทบัตรที่แลก',
      dataIndex: 'others',
      key: 'others',
      render: (text) => text ? text.CardTypeName : "-",
      width: 150
    },
    {
      title: 'สถานะการสแกนล่าสุด',
      dataIndex: 'others',
      key: 'others',
      render: (text) => text ? text.Scan_Status_Name : "-",
      width: 150
    },
    {
      title: 'วัน-เวลาสแกน',
      dataIndex: 'others',
      key: 'others',
      render: (text) => text ? moment(text.scan_date_time).format("DD/MM/YYYY") : "-",
      width: 150
    },
    {
      title: 'สถานะการแลคบัตร',
      dataIndex: 'others',
      key: 'others',
      render: (text) => text ? text.ExchangeCard_Status_Name : "-",
      width: 150
    },
    {
      title: 'วัน-เวลาแลคบัตร',
      dataIndex: 'ExchangeCard_Date',
      key: 'ExchangeCard_Date',
      render: (text, obj) => text ? moment(text).format("DD/MM/YYYY") + " " + obj.ExchangeCard_Time : "-",
      width: 200
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
                  "ชื่อ-สกุล": `${record.FirstName ?? "-"} ${record.LastName ?? ""}`,
                  "เลขบัตรประชาชน": `${record.PersonalID ?? "-"}`,
                  "ตำแหน่ง": `${record.Position ?? "-"}`,
                  "เลข Work Permit": `${record.WorkPermitID ?? "-"}`,
                  "เลขที่บัตรแสดงตัว/เลขที่บัตรที่แลก": `${record.SecureCard_ID ?? "-"}`,
                  "ประเภทบัตรที่แลก": `${record.others?.CardTypeName ?? "-"}`,
                  "ประเภทบุคคล": `${record.others?.PersonalTypeName ?? "-"}`,
                  "รหัสอุปกรณ์ที่แกน": `${record.ACC_ID ?? "-"}`,
                  "ชื่ออุปกรณ์ที่สแกน": `${record.AccDevice?.AccDeviceName ?? "-"}`,
                  "พื้นที่ที่ทำการสแกน": `${record.AreaName ?? "-"}`,
                  "สถานะการสแกน": `${record.others?.Scan_Status_Name ?? "-"}`,
                  "วันที่ที่ทำการสแกน": record.others.scan_date_time ? moment(record.others.scan_date_time).format("DD/MM/YYYY") : "-",
                  "เวลาที่ที่ทำการสแกน": record.others.scan_date_time ? moment(record.others.scan_date_time).format("HH:mm:ss") : "-",
                  "เลขที่อุปกรณ์ดิดตามตัว": `${record.PersonGPS_ID ?? "-"}`,
                  "เลขที่อุปกรณ์ติดตามยานพาหนะ": `${record.VehicleGPS_ID ?? "-"}`,
                  "วันที่ทำการแลกบัตร": record.ExchangeCard_Date ? moment(record.ExchangeCard_Date).format("DD/MM/YYYY") : "-",
                  "เวลาทำการแลกบัตร": record.ExchangeCard_Time ?? "-",
                  "สถานะการแลกบัตร": record.others?.ExchangeCard_Status_Name ?? "-",
                  "รหัสผู้ควบคุมงาน": record.PTTStaffCode ?? "-",
                  "ชื่อผู้ควบคุมงาน": `${record.PTTStaff_FName ?? "-"} ${record.PTTStaff_LName ?? ""}`,
                  "รหัสหน่วยงานผู้ควบคุม": `${record.AgencyCode ?? "-"}`,
                  "ชื่อหน่วยงานผู้ควบคุม": `${record.AgencyName ?? "-"}`,
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
      // console.log('stateView', stateView)
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

        let GetAllArea = await PTTlayer.SHOW_AREALAYERNAME();
        var Arealatlng = await Promise.all(GetAllArea.map(async (area, index) => {
          let extent = await area?.queryExtent();
          let feature = await area.queryFeatures();
          let namearea = feature?.features[0]?.attributes?.UNITNAME;
          let acesscontrol_type = await (await gen_uniqueValueInfos()).acessControlIcon;
          let maplatlng_type = acesscontrol_type.reduce((a, v) => ({ ...a, [v.name]: demodata.getRandomLocation(extent?.extent?.center?.latitude, extent?.extent?.center?.longitude, 60) }), {})
          return {
            name: namearea,
            center: extent?.extent?.center,
            typelatlng: maplatlng_type
          }
        }));
        0
        console.log('Arealatlng', Arealatlng)
        let latlng = []
        // console.log('item', item)
        // let acesscontrol_type = await (await gen_uniqueValueInfos()).acessControlIcon;
        // console.log('acesscontrol_type', acesscontrol_type)
        // let maplatlng_type = acesscontrol_type.reduce((a, v) => ({ ...a, [v.name]: demodata.getRandomLocation(12.719, 101.147, 60) }), {});

        // console.log('item.data', item.data)

        const filter_show_in_map = item.data.filter(where => where.others.show_in_map);
        // console.log('maplatlng_type :>> ', maplatlng_type);
        // console.log('filter_show_in_map', filter_show_in_map)
        for (const opp in filter_show_in_map) {
          const obj = filter_show_in_map[opp];


          let findeArea = Arealatlng?.find((area) => (area.name).replace(/#/i, '') == (obj.AreaName).replace(/#/i, ''))
          if(!findeArea) findeArea = Arealatlng[0]

        console.log('findeArea :>> ', findeArea);
        let getlatlng = findeArea?.typelatlng[obj.PersonalTypeID];
        if (obj.PersonalTypeID) {

          const { latitude, longitude } = demodata.getRandomLocation(getlatlng.latitude, getlatlng.longitude, 3)
          obj.status_work = `personal_${obj.PersonalTypeID}`;
          obj.latitude = latitude;
          obj.longitude = longitude;
        } else if ((obj.Lat && obj.Long)) {

          obj.status_work = `device_${obj.notification.offline ? "offline" : "online"}`;
          obj.latitude = obj.Lat;
          obj.longitude = obj.Long;
        }

        latlng.push({
          ...obj,
          "id": obj._id,
          "work_number": obj.WorkPermitNo,
          "name": obj.Name,
          "licensor": obj.PTTStaff,
          "supervisor": obj.OwnerName,
          "date_time_start": moment(new Date(obj.others.WorkingStart)).format("DD/MM/YYYY hh:mm:ss"),
          "date_time_end": moment(new Date(obj.others.WorkingEnd)).format("DD/MM/YYYY hh:mm:ss"),
          "status_work": obj.status_work,
          "latitude": obj.latitude,
          "longitude": obj.longitude,
          "locatoin": obj.SubAreaName,
          "work_type": obj.WorkpermitType,
        })

        //})
      }


      // console.log('latlng =>>>>>>>>>>>>>', latlng)
      const new_latlng = item.data.filter(w => w.others.on_table == true);
      // console.log('new_latlng', new_latlng)
      setTabledata(new_latlng);

      let datageojson = await Geojson.CleateGeojson(latlng, 'Point');
      // console.log('datageojson', datageojson)

      const [FeatureLayer, GeoJSONLayer] = await loadModules([
        'esri/layers/FeatureLayer',
        'esri/layers/GeoJSONLayer',
      ]);
      console.log('item', item)
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
          uniqueValueInfos: await (await gen_uniqueValueInfos(item.filter.PersonalTypeName)).uniqueValueInfos


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

const gen_uniqueValueInfos = async (type) => {
  try {
    const uniqueValueInfos = [];

    const acessControlIcon = [
      {
        name: "1",
        color: "rgba(19, 255, 0)",
        img: await CreateIcon("rgba(19, 255, 0)", false),
        detail: 'ผู้รับเหมาประจำ'
      },
      {
        name: "2",
        color: "rgba(255, 139, 0)",
        img: await CreateIcon("rgba(255, 139, 0)", false),
        detail: 'ผู้รับเหมาชั่วคราว'
      },
      {
        name: "3",
        color: "rgba(255, 251, 0)",
        img: await CreateIcon("rgba(255, 251, 0)", false),
        detail: 'ผู้มาติดต่อ'
      },
      {
        name: "4",
        color: "rgba(255, 0, 232)",
        img: await CreateIcon("rgba(255, 0, 232)", false),
        detail: 'ผู้มาเยี่ยมชม'
      },
      {
        name: "5",
        color: "rgba(0, 93, 255)",
        img: await CreateIcon("rgba(0, 93, 255)", false),
        detail: 'พนักงาน ปตท.'
      },

    ]

    const deviceStatusWork = [
      {
        name: "online",
        detail: "อุปกรณ์ Online",
        img: '/assets/iconmap/devices/online.svg',
        // img: '/assets/iconmap/scaffolding/19.svg',
      },
      {
        name: "offline",
        detail: "อุปกรณ์ Offline",
        img: '/assets/iconmap/devices/offline.svg',
        // img: '/assets/iconmap/scaffolding/20.svg',
      },
    ]

    if (isArray(type)) {

      var jsxsysmboleIcon = await Promise.all(acessControlIcon.map(async (item, index) => {
        return <div className='sysmbole_table' key={index.toString()}>
          <img src={item.img} alt="Avatar" className="avatar" />
          <span>{item.detail}</span>
        </div>
      }));
      var jsxsysmboleStatus = await Promise.all(deviceStatusWork.map(async (item, index) => {
        return item.img && <div className='sysmbole_table' key={index.toString()}>
          <img src={item.img} alt="Avatar" className="avatar" />
          <span>{item.detail}</span>
        </div>
      }));

      setstateSysmbole([jsxsysmboleIcon, jsxsysmboleStatus]);

      for (const key in type) {
        if (Object.hasOwnProperty.call(type, key)) {
          const a = type[key];
          const find = acessControlIcon.find(where => where.name == a.PersonalTypeID);
          if (isPlainObject(find)) {
            /* เพิ่ม */
            uniqueValueInfos.push({
              value: `personal_${find.name}`,
              symbol: {
                type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                url: await CreateIcon(find.color, find.img, 1),
                width: '15px',
                height: '15px',
              },
            })
          }
        }
      }

      for (const x in deviceStatusWork) {
        if (Object.hasOwnProperty.call(deviceStatusWork, x)) {
          const a = deviceStatusWork[x];
          const url = await CreateImgIcon(a.img, a.name === "offline" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/2048px-Antu_dialog-warning.svg.png" : false);
          uniqueValueInfos.push({
            value: `device_${a.name}`,
            symbol: {
              type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
              url,
              width: '30px',
              height: '30px',
            },
          })
        }
      }



      console.log("uniqueValueInfos -> accesscontrol", uniqueValueInfos)
    }
    return {
      acessControlIcon,
      uniqueValueInfos
    }

  } catch (error) {
    console.log('error', error)
  }
}



const Status_cal = async (data) => {

  // console.log('data', data)
  dispatch(
    setStatus({
      "สแกนเข้า": { value: data.in, color: '#F88' },
      "สแกนออก": { value: data.out, color: '#F48' },
      "แลกบัตรเข้า": { value: data.exchange_card_in, color: '#F82' },
      "บุคคลที่อยู่ในพื้นที่": { value: data.on_plant, color: '#F445' },
      "แลกบัตรออก": { value: data.exchange_card_out, color: '#F89' },
      "อุปกรณ์ Online": { value: data.online, color: '#112341' },
      "อุปกรณ์ Offline": { value: data.offline, color: '#112345' },
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

          {/* <Form.Item
              name="StartDateTime"
              label='วัน-เวลา เริ่มต้น'
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }} />
            </Form.Item> */}

          {/* <Form.Item
              name="EndDateTime"
              label='วัน-เวลา สิ้นสุด'
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }} />
            </Form.Item> */}

          <Form.Item
            name="AccDeviceName"
            label='อุปกรณ์ Access Control'
          >
            <Select
              showArrow
              style={{ width: '100%' }}
            >
              {AccDeviceNameOptions.map((e) => <Select.Option key={e.value}>{`${e.id}-${e.value}`}</Select.Option>)}
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
              {PersonalTypeNameOptions.map((e) => <Select.Option key={e.value}>{`${e.id}-${e.value}`}</Select.Option>)}
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
      rowKey={(i) => i.id}
      columns={columns}
      dataSource={tabledata}
    />
  </div>
)
}
export default AcessControlPage;
