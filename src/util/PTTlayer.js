import { loadModules } from 'esri-loader';
import Axios from 'axios';
import { randomPoint, randomPosition, booleanPointInPolygon, bboxPolygon, point } from '@turf/turf';
class PTTlayer {
    constructor() {
        (async () => {
            // this.GraphicLayer = await this.ADDAREALAYER();
            // return this.GraphicLayer;
        })();
    }
    AreaALL = [];


    ADDPTTWMSLAYER = async (map = null, view = null) => {
        const [Extent, MapImageLayer] = await loadModules([
            'esri/geometry/Extent',
            "esri/layers/MapImageLayer"
        ]);
        try {
            var layer = new MapImageLayer({
                url: 'https://nonpttarcgisserver.pttplc.com/arcgis/rest/services/PTT_SHIP/PTT_SHIP_MAP/MapServer',
            });
            if (map && view) {
                layer.when(async (data) => {
                    // console.log('extent', data.fullExtent.toJSON())
                    let extent = new Extent(data.fullExtent.toJSON());
                    // console.log('extent', data.fullExtent.toJSON())
                    await view?.goTo(extent)
                });
            }
            map.add(layer)
            return layer;
        } catch (error) {
            let extent = {
                spatialReference: { latestWkid: 32647, wkid: 32647 },
                xmax: 733175.5896,
                xmin: 732417.1658,
                ymax: 1407627.0716,
                ymin: 1406522.6592,
            }
            let CreateExtent = new Extent(extent);
            await view?.goTo(CreateExtent)
            return;

        }
    }

    ADDAREALAYER = async (layername = "PLANT") => {
        const [Graphic, GeoJSONLayer] = await loadModules([
            "esri/Graphic",
            'esri/layers/GeoJSONLayer'
        ]);
        const apiArea = await Axios.post(`${process.env.REACT_APP_PTT_PROXY}${btoa("user=dashboard&system=api")}/api/track/attribute`,
            [
                {
                    "LAYER_NAME": layername,
                    "SEARCH_COLUMN": []
                }
            ],
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            }
        );
        if (apiArea.status == 200) {
            const { data: { data } } = apiArea;
            const layerArea = data.length > 0 ? data[0].RESULT : null;
            if (layerArea) {
                this.AreaALL = layerArea;
                let Creategeojsonlayer = layerArea.map((area) => {
                    let geojson = {
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                "properties": area,
                                "geometry": {
                                    "type": "Polygon",
                                    "coordinates": area.SHAPE.GEOMETRY
                                }
                            }
                        ]
                    }
                    const blob = new Blob([JSON.stringify(geojson)], {
                        type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    const uniqueValuesByColorProperty = {
                        type: "unique-value",
                        field: "color",
                        defaultSymbol: {
                            type: "simple-fill",
                            color: [0, 255, 222, 0.3],
                            outline: {
                                color: [0, 255, 222],
                                width: 1
                            },
                            width: 1,
                            style: "solid"
                        },
                        defaultLabel: "Other polygons", //  used in the Legend widget for types not specified
                        uniqueValueInfos: [{
                            value: "red",
                            symbol: {
                                type: "simple-fill",
                                color: "red"
                            },
                            label: "Red polygons" // displayed in the Legend widget
                        },
                        {
                            value: "yellow",
                            symbol: {
                                type: "simple-fill",
                                color: "yellow"
                            },
                            label: "Yellow polygons" // displayed in the Legend widget
                        }
                        ]
                    };
                    const geojsonlayer = new GeoJSONLayer({
                        url: url,
                        copyright: "PTT",
                        renderer: uniqueValuesByColorProperty,
                        popupTemplate: {
                            title: "{UNITNAME}",
                            content: [
                                {
                                    type: "fields",
                                    fieldInfos: [
                                        {
                                            fieldName: "OBJECTID"
                                        },
                                        {
                                            fieldName: "UNITID"
                                        },
                                        {
                                            fieldName: "SUBUNITNAME"
                                        },
                                        {
                                            fieldName: "UNITNAME"
                                        }
                                    ]
                                }
                            ]
                        }
                    });
                    return geojsonlayer;
                });
                return Creategeojsonlayer;
                // let GraphicAll = layerArea.map((area) => {
                //     const fillSymbol = {
                //         type: "simple-fill",
                //         color: [227, 139, 79, 0.8],
                //         outline: {
                //             color: [255, 255, 255],
                //             width: 1
                //         }
                //     };
                //     const polygon = {
                //         type: String(area.SHAPE.TYPE).toLowerCase(),
                //         rings: area.SHAPE.GEOMETRY
                //     }
                //     const polygonGraphic = new Graphic({
                //         geometry: polygon,
                //         symbol: fillSymbol,
                //         attributes: area,
                //         popupTemplate: {
                //             title: "{UNITNAME}",
                //             content: [
                //                 {
                //                     type: "fields",
                //                     fieldInfos: [
                //                         {
                //                             fieldName: "OBJECTID"
                //                         },
                //                         {
                //                             fieldName: "SUBUNITNAME"
                //                         },
                //                         {
                //                             fieldName: "UNITNAME"
                //                         }
                //                     ]
                //                 }
                //             ]
                //         }
                //     });
                //     return polygonGraphic;
                // })
                // console.log('GraphicAll :>> ', GraphicAll);
                // return GraphicAll;
            }

            return apiArea
        } else {
            console.error("API ERROR GISMAP REQUSE")
            return null
        }
    }

    GET_ALLAREALAYERNAME = async (layername = "PLANT") => {
        const apiArea = await Axios.post(`${process.env.REACT_APP_PTT_PROXY}${btoa("user=dashboard&system=api")}/api/track/attribute`,
            [
                {
                    "LAYER_NAME": layername,
                    "SEARCH_COLUMN": []
                }
            ],
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            }
        );
        if (apiArea.status == 200) {
            const { data: { data } } = apiArea;
            const layerArea = data.length > 0 ? data[0].RESULT : null;
            return layerArea;
        }
    }
    SHOW_AREALAYERNAME = async (artibute = false, name = false) => {
        const layerALl = this.GraphicLayer ?? this.ADDAREALAYER();
        if (artibute && name) {
            let AREAIS = layerALl.filter((layer) => {
                let aributename = layer.attributes;
                // console.log('aributename[artibute] :>> ', aributename[artibute]);
                if (aributename[artibute] == name) {
                    return layer;
                }
            });
            return AREAIS;
        } else {
            return layerALl;
        }

    }

    CLICK_SHOWLATLONG = async (view) => {
        const [locator] = await loadModules([
            'esri/rest/locator',
        ])
        const geocodingServiceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
        view.on("click", function (event) {
            if (event.button === 2) {
                event.stopPropagation(); // overwrite default click-for-popup behavior
                // console.log('event.mapPoint :>> ', event.mapPoint);
                var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
                view.popup.open({
                    title: "??????????????????????????????????????????: [" + lat + "," + lon + "]",
                    location: event.mapPoint // Set the location of the popup to the clicked location
                });
                // Display the popup
                locator.locationToAddress(geocodingServiceUrl, { location: event.mapPoint }).then((res) => {
                    view.popup.content = res.address;
                })
            }
        });
    }

    GETMASTER_AREA_LAYERGIS = async (payload = [
        {
            "LAYER_NAME": "PLANT",
            "SEARCH_COLUMN": []
        },
        {
            "LAYER_NAME": "AREA",
            "SEARCH_COLUMN": []
        },
        {
            "LAYER_NAME": "BUILDING",
            "SEARCH_COLUMN": []
        },
        {
            "LAYER_NAME": "EQUIPMENT",
            "SEARCH_COLUMN": []
        }
    ]) => {
        const data = await Axios.post(`${process.env.REACT_APP_PTT_PROXY}${btoa("user=dashboard&system=api")}/api/track/attribute`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            }
        );
        if (data.status == 200) {
            // console.log('data.data', data.data.data)
            return data.data.data;
        }
    }

    RandomInArea = async (extent) => {
        const [Point] = await loadModules([
            "esri/geometry/Point",
        ]);
        var x_max = extent.xmax;
        var x_min = extent.xmin;
        var y_max = extent.ymax;
        var y_min = extent.ymin;
        var lat = y_min + (Math.random() * (y_max - y_min));
        var lng = x_min + (Math.random() * (x_max - x_min));
        let point = new Point({ latitude: parseFloat(lat), longitude: parseFloat(lng) });
        let contains = extent.contains(point);
        // console.log('extent :>> ', extent);
        // console.log('point :>> ', point);
        // console.log('lat', lat)
        // console.log('lng', lng)
        // var points = randomPosition([x_min, y_min, x_max, y_max] )
        // var pt = point(points);
        // var pt = randomPoint(1, {bbox:[x_min, y_min, x_max, y_max] });
        // let getlatlng = pt.features[0].geometry.coordinates;
        // var poly = bboxPolygon([x_min, y_min, x_max, y_max]);
        // let check = booleanPointInPolygon(getlatlng,poly,{ignoreBoundary:true})
        console.log('contains :>> ', contains);
        // console.log('getlatlng :>> ', getlatlng);
        // let point = new Point({ latitude: getlatlng[1], longitude: getlatlng[0] });
        // let contains = extent.contains(point);
        // console.log('contains :>> ', contains);
        // return {
        //     latitude: getlatlng[1],
        //     longitude: getlatlng[0]
        // }
        // if (contains == true) {
        //     console.log('containstrue :>> ', contains);

        //     return {
        //         latitude: lat,
        //         longitude: lng
        //     }
        // } else {
        //     console.log('containsfalse :>> ', contains);

        //     return this.RandomInArea(extent)
        // }
    }

}





export default PTTlayer;
