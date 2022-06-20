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
import WaGeojson from '../../../util/WaGeojson';
import { CreateIcon, CreateImgIcon } from '../../../util/dynamic-icon'
import API from '../../../util/Api'
import { isArray } from 'lodash';
import PTTlayers from '../../../util/PTTlayer'



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
      dataIndex: 'VendorName',
      key: 'VendorName',
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
                  "ประเภทผู้ขอรายการ": record.OwnerType ?? "-",
                  "รหัสผู้ขอรายการ": record.WorkOwnerID ?? "-",
                  "ชื่อ นามสกุล": record.WorkName ?? "-",
                  "เลขบัตรประชาชน": record.PersonalID ?? "-",
                  "เลข Work Permit": record.WorkPermitNo ?? "-",
                  "รหัสประเภทนั่งร้าน": record.ScaffoldingTypeID ?? "-",
                  "ชื่องาน": record.Title ?? "-",
                  "รายละเอียดของงาน": record.Description ?? "-",
                  "วัตถุประสงค์": record.Objective ?? "-",
                  "วันหมดอายุสภาพนั่งร้าน": record.ExpiredDate ?? "-",
                  "รหัสสถานที่ปฏิบัติงานหลัก": record.Area ?? "-",
                  "ชื่อสถานที่ปฏิบัติงานหลัก": record.AreaName ?? "-",
                  "รหัสสถานที่ปฏิบัติงานย่อย": record.SubArea ?? "-",
                  "ชื่อสถานที่ปฏิบัติงานย่อย": record.SubAreaName ?? "-",
                  "ข้อมูลพิกัดนั่งร้าน": record.Features ?? "-",
                  "ข้อมูลคุณสมบัตินั่งร้าน": record.FeaturesProperties ?? "-",
                  "วัน เวลา เริ่มต้นการปฏิบัติงาน": record.WorkingStartDate ?? "-",
                  "วัน เวลา สิ้นสุดการปฏิบัติงาน": record.WorkingEndDate ?? "-",
                  "รหัสบริษัท": record.VendorCode ?? "-",
                  "ชื่อบริษัท": record.VendorName ?? "-",
                  "รหัสผู้ควบคุมงาน": record.PTTStaffCode ?? "-",
                  "ชื่อผู้ควบคุมงาน": record.PTTStaff ?? "-",
                  "รหัสหน่วยงานผู้ควบคุม": record.AgencyID ?? "-",
                  "ชื่อหน่วยงานผู้ควบคุม": record.AgencyName ?? "-",
                  "รหัสเจ้าของพื้นที่": record.Owner ?? "-",
                  "ประเภทของ Work": record.WorkpermitType ?? "-",
                  "สถานะใบงาน": record.StatusID ?? "-",
                  "สถานะแจ้งเตือน": record.StatusID ?? "-",

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
    socket.on("scaffolding", (res) => {
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
        console.log('status_work', `A${obj.ScaffoldingTypeID}_${obj.Status.toLowerCase()}`)

        return {
          ...obj,
          "id": obj._id,
          "work_number": obj.WorkPermitNo,
          "name": obj.Name,
          "licensor": obj.PTTStaff,
          "supervisor": obj.OwnerName,
          "date_time_start": moment(new Date(obj.EndDateTime)).format("DD/MM/YYYY hh:mm:ss"),
          "date_time_end": moment(new Date(obj.StartDateTime)).format("DD/MM/YYYY hh:mm:ss"),
          // "status_work": obj.WorkPermitStatus.toLowerCase(),
          "status_work": `A${obj.ScaffoldingTypeID}_${obj.Status.toLowerCase()}`,
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
          title: "{OwnerName}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "OwnerName"
                },
                {
                  fieldName: "WarningStatus"
                },
                {
                  fieldName: "WorkpermitType"
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
          img: '/assets/iconmap/scaffolding/1.svg'
        },
        {
          name: "2",
          img: '/assets/iconmap/scaffolding/2.svg'
        },
        {
          name: "3",
          img: '/assets/iconmap/scaffolding/3.svg'
        },
        {
          name: "4",
          img: '/assets/iconmap/scaffolding/4.svg'
        },
        {
          name: "5",
          img: '/assets/iconmap/scaffolding/5.svg'
        },
        {
          name: "6",
          img: '/assets/iconmap/scaffolding/6.svg'
        },
        {
          name: "7",
          img: '/assets/iconmap/scaffolding/7.svg'
        },
        {
          name: "8",
          img: '/assets/iconmap/scaffolding/8.svg'
        },
        {
          name: "9",
          img: '/assets/iconmap/scaffolding/9.svg'
        },
        {
          name: "10",
          img: '/assets/iconmap/scaffolding/10.svg'
        },
        {
          name: "11",
          img: '/assets/iconmap/scaffolding/11.svg'
        },
        {
          name: "12",
          img: '/assets/iconmap/scaffolding/12.svg'
        },
        {
          name: "13",
          img: '/assets/iconmap/scaffolding/13.svg'
        },
        {
          name: "14",
          img: '/assets/iconmap/scaffolding/14.svg'
        },
        {
          name: "15",
          img: '/assets/iconmap/scaffolding/15.svg'
        },
        {
          name: "16",
          img: '/assets/iconmap/scaffolding/16.svg'
        },
        {
          name: "17",
          img: '/assets/iconmap/scaffolding/17.svg'
        },
        {
          name: "18",
          img: '/assets/iconmap/scaffolding/18.svg'
        },
        {
          name: "19",
          img: '/assets/iconmap/scaffolding/19.svg'
        },
        {
          name: "20",
          img: '/assets/iconmap/scaffolding/20.svg'
        },
        {
          name: "21",
          img: '/assets/iconmap/scaffolding/21.svg'
        },
        {
          name: "22",
          img: '/assets/iconmap/scaffolding/22.svg'
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
                value: `A${a.name}_${b.name}`,
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

    } catch (error) {
      // debugger
      console.log('error', error)
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

  const [scaffoldingTypeOptions, setScaffoldingTypeOptions] = useState([]);
  const [form] = Form.useForm()

  const getScaffolding = async (item, openTableBool) => {
    let url = `/scaffolding/all?`;
    if (item.PTTStaffCode) url += `&PTTStaffCode=${item.PTTStaffCode}`;
    if (item.VendorCode) url += `&VendorCode=${item.VendorCode}`;
    if (item.StartDateTime) url += `&StartDateTime=${item.StartDateTime}`;
    if (item.EndDateTime) url += `&EndDateTime=${item.EndDateTime}`;
    if (item.AreaID) url += `&AreaID=${item.AreaID}`;
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
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            name='nest-messages'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="PTTStaffCode"
              label='รหัสพนักงานผู้ควบคุมงาน'
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="VendorCode"
              label='บริษัทควบคุมงาน'
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
              label='ประเภทนั่งร้าน'
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
        <div ref={refdetail} className='menuserchslide detailemo esri-widget'>
          <Row>
            <Col span={8}>
              <p>ใช้ 8 สีแทนประเภท</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridGap: '5px',
                }}
              >
                <span>🔴</span>
                <span>🟠</span>
                <span>🟡</span>
                <span>🟢</span>
                <span>🔵</span>
              </div>
            </Col>
            <Col span={8}>
              <p>ใช้ 2 สีแทนประเภท</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridGap: '5px',
                }}
              >
                <span>🟢</span>
                <span>🔵</span>
              </div>
            </Col>
            <Col span={8}>
              <p>ใช้สัญลักษณ์แทนการแจ้งเตือน</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridGap: '5px',
                }}
              >
                <span>🚸</span>
                <span>⛔</span>
                <span>✅</span>
                <span>🛑</span>
                <span>🚯</span>
              </div>
            </Col>
          </Row>
        </div>

      </Map>

      {/* <div id="viewDiv" style={{height:'70vh'}}></div> */}

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
        rowKey={(i) => i.id}
        columns={columns2}
        dataSource={tabledata}
      />
    </div>
  );
};

export default ScaffoldingPage;
