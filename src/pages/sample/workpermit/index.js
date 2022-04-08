import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, InfoWindow, withGoogleMap } from 'react-google-maps';
import { Map, WebScene, } from '@esri/react-arcgis';
import { setDefaultOptions, loadModules } from 'esri-loader';


setDefaultOptions({ css: true });

const Page1 = () => {
  const [stateMap, setStateMap] = useState(null);
  const [stateView, setStateView] = useState(null);

  useEffect(() => {
    (async () => {
      const WFSLayer = await loadModules(["esri/layers/WFSLayer"]).then(([WFSLayer]) => WFSLayer);
      const layer2 = new WFSLayer({
        url: "https://pttarcgisserver.pttplc.com/arcgis/services/PTT_LMA/GIS_PatternData/MapServer/WFSServer?request=GetCapabilities&service=WFS",

      });
      const WMSLayer = await loadModules(["esri/layers/WMSLayer"]).then(([WMSLayer]) => WMSLayer);
      const layer = new WMSLayer({
        url: "https://pttarcgisserver.pttplc.com/arcgis/services/PTT_LMA/GIS_PatternData/MapServer/WMSServer?request=GetCapabilities&service=WMS",

      });
      layer.load().then(() => {
        const names = layer.allSublayers
          .filter((sublayer) => !sublayer.sublayers) // Non-grouping layers will not have any "sublayers".
          .map((sublayer) => sublayer.name);
        console.log("Names of all child sublayers", names.join());
      });
      stateMap?.add(layer)
      GetCluster()
    })();
  }, [stateMap, stateView,]);

  loadModules(["esri/config", "esri/Map", 'esri/views/MapView', "esri/layers/TileLayer"])
    .then(async ([esriConfig, Map, MapView, TileLayer]) => {
      esriConfig.apiKey = "AAPKf24959e55476492eb12c8cbaa4d1261etdgkaLK718fs8_EuvckemKt2gyRR-8p04PR7mC2G8Oi5oNli_65xV-C8u8BuPQTZ";

      // var map = new Map({
      //   basemap: "streets"
      // });

      // var view = new MapView({
      //   container: "viewDiv",  // Reference to the DOM node that will contain the view
      //   map: map               // References the map object created in step 3
      // });

      // const Fullscreen = await loadModules(["esri/widgets/Fullscreen"]).then(([Fullscreen]) => Fullscreen);
      // const full = new Fullscreen({
      //   view: view
      // });
      // console.log('full :>> ', full);
      // view.ui.add(full, "top-left");


    });





  const GetCluster = async () => {
    loadModules([
      "esri/layers/FeatureLayer",
      "esri/layers/GeoJSONLayer",
      "esri/views/MapView",
      "esri/widgets/Legend",
      "esri/widgets/Expand",
      "esri/widgets/Home",
      "esri/Graphic"
    ])
      .then(([FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home, Graphic]) => {
        const clusterConfig = {
          type: "cluster",
          clusterRadius: "100px",
          // {cluster_count} is an aggregate field containing
          // the number of features comprised by the cluster
          popupTemplate: {
            title: "Cluster summary",
            content: "This cluster represents {cluster_count} earthquakes.",
            fieldInfos: [
              {
                fieldName: "cluster_count",
                format: {
                  places: 0,
                  digitSeparator: true
                }
              }
            ]
          },
          clusterMinSize: "24px",
          clusterMaxSize: "60px",
          labelingInfo: [
            {
              deconflictionStrategy: "none",
              labelExpressionInfo: {
                expression: "Text($feature.cluster_count, '#,###')"
              },
              symbol: {
                type: "text",
                color: "#004a5d",
                font: {
                  weight: "bold",
                  family: "Noto Sans",
                  size: "12px"
                }
              },
              labelPlacement: "center-center"
            }
          ]
        };

        const layer = new GeoJSONLayer({
          title: "Earthquakes from the last month",
          url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
          copyright: "USGS Earthquakes",

          featureReduction: clusterConfig,

          // popupTemplates can still be viewed on
          // individual features
          popupTemplate: {
            title: "Magnitude {mag} {type}",
            content: "Magnitude {mag} {type} hit {place} on {time}",
            fieldInfos: [
              {
                fieldName: "time",
                format: {
                  dateFormat: "short-date-short-time"
                }
              }
            ]
          },
          renderer: {
            type: "simple",
            field: "mag",
            symbol: {
              type: "simple-marker",
              size: 4,
              color: "#69dcff",
              outline: {
                color: "rgba(0, 139, 174, 0.5)",
                width: 5
              }
            }
          }
        });

        const point = {
          type: "point", // autocasts as new Point()
          longitude: -49.97,
          latitude: 41.73
        };
        const markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        };
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol
        });
        stateView?.graphics?.addMany([pointGraphic]);
        // stateMap?.add(layer);
      });


  }

  const Onload = async (map, view) => {
    const { Fullscreen, UI } = await loadModules(["esri/widgets/Fullscreen", "esri/views/ui/UI"]).then(([Fullscreen, UI]) => { return { Fullscreen, UI } });
    const full = new Fullscreen({
      view: view
    });
    view.ui.add(full, "top-left");
    view.ui.add("logoDiv", "top-right");


    setStateMap(map);
    setStateView(view);
    // console.log('map,view :>> ', map, view);
  }
  return (
    <div>
      <Map className="Map" onLoad={Onload} mapProperties={{ basemap: 'arcgis-navigation', autoResize: false }} viewProperties={{ center: [100.3330867, 14.5548052] }} />
      {/* <div id="viewDiv" style={{height:'70vh'}}></div> */}
      <div id="logoDiv" className="esri-icon-search"></div>
    </div>
  )
}

export default Page1