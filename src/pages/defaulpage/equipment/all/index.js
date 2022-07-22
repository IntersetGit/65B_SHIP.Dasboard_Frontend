import React, { useEffect, useState, useRef } from 'react';
import { Form, Collapse } from 'antd';
import { Map } from '@esri/react-arcgis';
import { loadModules } from 'esri-loader';
import './index.style.less';
import socketClient from '../../../../util/socket';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../../../redux/actions';
import moment, { isMoment } from 'moment';
import Demodata from '../../../demodata';
import WaGeojson from '../../../../util/WaGeojson';
import { CreateIcon, CreateImgIcon } from '../../../../util/dynamic-icon'
import API from '../../../../util/Api'
import { isArray, isNumber, isPlainObject } from 'lodash';
import PTTlayers from '../../../../util/PTTlayer'
import Searchlayer from '../../../../components/Searchlayer/index'
import { Helmet } from 'react-helmet';
import TableData from '../TableData';
import FromDataSearch from '../FromDataSearch';

const { Panel } = Collapse;

const EquipmentAllPage = () => {
  const [filter, setFilter] = useState({})
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);
  const refdrawn = useRef();
  const refdetail = useRef();
  const refgismap = useRef();

  const [tabledata, setTabledata] = useState(null);

  const dispatch = useDispatch();
  const Geojson = new WaGeojson();
  const demodata = new Demodata('access_control');
  const [stateSysmbole, setstateSysmbole] = useState(null);
  const PTTlayer = new PTTlayers();

  const [form] = Form.useForm()


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

  const getEquipment = async (item, openTableBool) => {
    let url = `/equipment/all?`;
    if (item.PTTStaffCode) url += `&PTTStaffCode=${item.PTTStaffCode}`;
    if (item.AgencyName) url += `&AgencyName=${item.AgencyName}`;
    if (item.AreaName) {
      const AreaName = (item.AreaName).replace(/#/i, '%23')
      url += `&AreaName=${AreaName}`;
    };
    if (isArray(item.EquipmentType)) {
      url += `&EquipmentType=${item.EquipmentType.toString()}`;
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
    const resSf = await getEquipment({});
    setLayerpoint(resSf)
    socket.on("equipment", async (res) => {
      const resSf = await getEquipment(form.getFieldValue());
      setLayerpoint(resSf)
    });
  }


  const setLayerpoint = async (item) => {
    try {
      // console.log('stateView', stateView)
      if (stateView) {

        Status_cal(item.summary);

        if (isPlainObject(item.filter)) {
          setFilter(item.filter);
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
        // console.log('Arealatlng', Arealatlng)
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
          if (!findeArea) findeArea = Arealatlng[0]

          // console.log('findeArea :>> ', findeArea);
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
          color: "#8A2BE2",
          img: await CreateIcon("#8A2BE2", false),
          detail: 'ผู้รับเหมาประจำ'
        },
        {
          name: "2",
          color: "#FF8C00",
          img: await CreateIcon("#FF8C00", false),
          detail: 'ผู้รับเหมาชั่วคราว'
        },
        {
          name: "3",
          color: "#00CED1",
          img: await CreateIcon("#00CED1", false),
          detail: 'ผู้มาติดต่อ'
        },
        {
          name: "4",
          color: "#FF6699",
          img: await CreateIcon("#FF6699", false),
          detail: 'ผู้มาเยี่ยมชม'
        },
        {
          name: "5",
          color: "#000080",
          img: await CreateIcon("#000080", false),
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

    // all: 40
    // expire: 5
    //   in: 0
    // near_expire: 5
    // not_remove: 5
    // obstruct: 8
    // out: 5
    // risk: 35
    dispatch(
      setStatus({
        "อุปกรณ์เสี่ยง": { value: data.in, color: '#F88' },
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
    view.ui.add(
      new Expand({
        view,
        content: refgismap.current,
        expandIconClass: "esri-icon-layer-list",
        expanded: false,
      }),
      "top-left"
    );



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

      // console.log('first', getEquipment(model))
      setLayerpoint(await getEquipment(model, true))

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

      <Helmet>
        <title>อุปกรณ์เสี่ยง | Equipment | DashBoard</title>
      </Helmet>
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
        <Searchlayer ref={refgismap} map={stateMap} view={stateView} />
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

        <div ref={refdrawn} id='viewtest' className='menuserchslide esri-widget'>
          <FromDataSearch form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} reset={reset} filter={filter} />
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

      <TableData dataSource={tabledata} />
    </div>
  )
}
export default EquipmentAllPage;
