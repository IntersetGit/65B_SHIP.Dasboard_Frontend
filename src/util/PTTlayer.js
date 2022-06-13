import { loadModules } from 'esri-loader';
import Axios from 'axios';

class PTTlayer {
    constructor() {
        (async () => {
            this.GraphicLayer = await this.ADDAREALAYER();

        })();

    }

    AreaALL = [];

    ADDPTTWMSLAYER = async (map = null, view = null) => {
        const [Extent, MapImageLayer] = await loadModules([
            'esri/geometry/Extent',
            "esri/layers/MapImageLayer"
        ]);
        var layer = new MapImageLayer({
            url: 'https://nonpttarcgisserver.pttplc.com/arcgis/rest/services/PTT_SHIP/PTT_SHIP_MAP/MapServer',
        });
        if (map && view) {
            layer.when(async (data) => {
                // console.log('extent', data.fullExtent.toJSON())
                let extent = new Extent(data.fullExtent.toJSON());
                await view?.goTo(extent)
            });
        }
        map.add(layer)
        return layer;
    }

    ADDAREALAYER = async () => {
        const [Graphic,] = await loadModules([
            "esri/Graphic",
        ]);
        const apiArea = await Axios.post(`${process.env.REACT_APP_PTT_PROXY}${btoa("user=dashboard&system=api")}/api/track/attribute`,
            [
                {
                    "LAYER_NAME": "AREA",
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
            this.AreaALL = layerArea;
            if (layerArea) {
                let GraphicAll = layerArea.map((area) => {
                    const fillSymbol = {
                        type: "simple-fill",
                        color: [227, 139, 79, 0.8],
                        outline: {
                            color: [255, 255, 255],
                            width: 1
                        }
                    };
                    const polygon = {
                        type: String(area.SHAPE.TYPE).toLowerCase(),
                        rings: area.SHAPE.GEOMETRY
                    }
                    const polygonGraphic = new Graphic({
                        geometry: polygon,
                        symbol: fillSymbol,
                        attributes: area,
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
                    return polygonGraphic;
                })
                // console.log('GraphicAll :>> ', GraphicAll);
                return GraphicAll;
            }


        }
        return apiArea
    }

    GET_ALLAREALAYERNAME = async () => {
        let Area = this.AreaALL;
        return Area;
    }
    SHOW_AREALAYERNAME = async (artibute = false, name = false) => {
        const layerALl = this.GraphicLayer;
        if (artibute && name) {
            let AREAIS = layerALl.filter((layer) => {
                let aributename = layer.attributes;
                console.log('aributename[artibute] :>> ', aributename[artibute]);
                if (aributename[artibute] == name) {
                    return layer;
                }
            });
            return AREAIS;
        } else {
            return layerALl;
        }

    }

    CLICK_SHOWLATLONG = async(view) => {
        const [locator] = await loadModules([
            'esri/rest/locator',
          ])
        const geocodingServiceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
        view.on("click", function (event) {
            event.stopPropagation(); // overwrite default click-for-popup behavior
            // console.log('event.mapPoint :>> ', event.mapPoint);
            var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
            var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
            view.popup.open({
                title: "ตำแหน่งที่ตั้ง: [" + lat + "," + lon + "]",
                location: event.mapPoint // Set the location of the popup to the clicked location
            });
            // Display the popup
            locator.locationToAddress(geocodingServiceUrl, { location: event.mapPoint }).then((res) => {
                view.popup.content = res.address;
            })
        });
    }

}





export default PTTlayer;
