import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { GoogleMap, InfoWindow, withGoogleMap } from 'react-google-maps';
import { Map } from '@esri/react-arcgis';
import { setDefaultOptions, loadModules } from 'esri-loader';
setDefaultOptions({ css: true });

const google = window.google;

const Mapsgoogle = withGoogleMap((props) => (
  <GoogleMap
    ref={props.onMapMounted}
    onZoomChanged={props.onZoomChanged}
    defaultCenter={props.center}
    defaultOptions={{ fullscreenControl: false, zoomControl: false, streetViewControl: false }}
    zoom={props.zoom}>
    <InfoWindow defaultPosition={props.center}>
      <div>{props.content}</div>
    </InfoWindow>
  </GoogleMap>
));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function Page1() {
  const Mapref = useRef();
  const [stateMap, setStateMap] = useState(null);

  loadModules(["esri/Map",'esri/views/MapView', 'esri/WebMap'])
    .then(([Map,MapView, WebMap]) => {
      const map = new Map({
        basemap: "topo-vector"
      });

      const view = new MapView({
        container: "viewDiv",
        map: map
      });
    });
  useEffect(() => {


  }, []);


  // useLayoutEffect(() => {
  //   if (stateMap) {
  //     console.log('Mapref :>> ', Mapref);
  //       // const marker = new google.maps.Marker({
  //       //   position: { lat: -34.397, lng: 150.644 },
  //       //   map: stateMap.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  //       // });
  //       stateMap.addListener("click", (mapsMouseEvent) => {
  //         console.log('mapsMouseEvent :>> ', mapsMouseEvent);
  //         // Close the current InfoWindow.
  //         // infoWindow.close();
  //         // // Create a new InfoWindow.
  //         let infoWindow = new google.maps.InfoWindow({
  //           position: mapsMouseEvent.latLng,
  //         });
  //         infoWindow.setContent(
  //           JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
  //         );
  //         infoWindow.open(stateMap);
  //       });
  //   }
  // }, [stateMap]);



  return (
    <div>
      {/* <Mapsgoogle
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `60vh` }} />}
        onMapMounted={(m) => {setStateMap(m?.context?.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED),Mapref.current = m}}
        // onZoomChanged={onMapmount}
        center={new google.maps.LatLng(47.646935, -122.303763)}
        zoom={15}
        content={"Change the zoom level"}
      /> */}
      <Map  style={{ height: 500 }}  mapProperties={{ basemap: {portalItem: {
            id: "8d91bd39e873417ea21673e0fee87604" // nova basemap
          }} }} />
      {/* <div className='viewDiv' id="viewDiv" style={{height:500}}></div> */}


    </div>
  )
}

export default Page1