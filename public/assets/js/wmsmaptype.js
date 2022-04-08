//UPDATE BY AUNWA007

function WmsMapType(name, url, params, options, type = "geoserver") {
    var TILE_SIZE = 256;
    var EARTH_RADIUS_IN_METERS = 6378137;
    var CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS_IN_METERS;
    this.type = type;
    this.name = name;
    this.url = type == "arcgisimageserver" ? url.replace("/rest", "") + '/WMSServer' : url;
    this.urlwms = url.replace("/rest", "") + '/WMSServer';
    this.tileSize = new google.maps.Size(TILE_SIZE, TILE_SIZE); // required by API
    this.eventclick = [];
    this.tiles = []; // maintain managed tiles

    /*
     * Params representing key/value pairs included in the GetMap query.
     *
     * Set default values and then override as needed.
     */
    this.params = {
        // General
        service: 'WMS',
        version: type == "arcgisimageserver" ? '1.3.0' : '1.1.1',
        request: 'GetMap',

        // Image props
        transparent: true,
        format: 'image/png',
        width: this.tileSize.width,
        height: this.tileSize.height,

        // Spatial Reference System
        // srs: 'EPSG:4326',
        srs: 'EPSG:3857',
        // crs: 'EPSG:4326',
        crs: 'EPSG:3857',

        // Style
        styles: '',

        // Layers
        layers: type == "arcgisimageserver" ? '0' : ''
    };
    for (var key in params) {
        this.params[key] = params[key];
    }

    /*
     * Extra options.
     *
     * Set default values and then override as needed.
     */
    this.options = {
        opacity: 0.5,
        cache: true
    };

    for (var key in options) {
        this.options[key] = options[key];
    }

    /*
     * Prototype getTile method.
     */
    this.getTile = function (coord, zoom, ownerDocument) {
        // if (!this.params['layers'].length) {
        if (!this.params['layers']) {
            console.log("[WmsMapType] Required param 'layers' is empty");
            this.params['layers'] = '0';
            // return ownerDocument.createElement('div'); // empty div
        }
        var url = this.url + "?";

        for (var key in this.params) {
            url += key + "=" + this.params[key] + "&";
        }

        var bounds = getBounds(coord.x, coord.y, zoom);
        url += `${this.type == "arcgisimageserver" ? 'BBOX=' : 'bbox='}` + bounds.swX + "," + bounds.swY + "," + bounds.neX + "," + bounds.neY;

        if (this.options['cache'] == false) {
            var date = new Date();
            url += "&cache=" + date.getTime();
        }

        var div = ownerDocument.createElement('div');
        div.innerHTML = '<img  src="' + url + '"/>';
        div.style.width = this.tileSize.width + 'px';
        div.style.height = this.tileSize.height + 'px';
        div.style.opacity = this.options['opacity'];

        this.tiles.push(div);

        return div;
    };

    /*
     * Add this MapType to a map at the given index, or on top of other layers
     * if index is omitted.
     */
    this.addToMap = async function (map, zoom = true, index = 1) {

        // console.log("map.overlayMapTypes", map.overlayMapTypes)

        // await map.overlayMapTypes.addListener("insert_at", (e) => {
        //     console.log('"object2" :>> ', map.overlayMapTypes);

        // });

        // if (index !== undefined) {
        //     map.overlayMapTypes.insertAt(Math.min(index, map.overlayMapTypes.getLength()), this);
        // } else {

        if (this.type == "geoserver" || this.type == "arcgisimageserver" || this.type == null) {
            // await map.overlayMapTypes.push(this);

            await map.overlayMapTypes.insertAt(map.overlayMapTypes.getLength(), this);

            if (zoom) {
                this.zoomToWms(map);
            }
        } else {
            this.Arcgiswms(map, index);
            if (zoom) {
                this.ZoomToArcgis(map);
            }
        }
        // const infowindow = new google.maps.InfoWindow();

        // this.eventclick = new google.maps.event.addListener(map, "click", async (e) => {
        //     let result = await this.GetfeatureData(e, map);
        //     if (result) {
        //         infowindow.close()
        //         infowindow.setContent(`${result}`);
        //         infowindow.setPosition(e.latLng);
        //         infowindow.open(map)
        //     }
        // });

    };

    /*
     * Remove this MapType from a map.
     */
    this.removeFromMap = function (map) {


        var overlayTypes = map.overlayMapTypes;

        for (var i = 0; i < overlayTypes.getLength(); i++) {
            var element = overlayTypes.getAt(i);
            //   console.log("element",element.name)
            //   console.log("thisis",this.name)
            if (element.name !== undefined && element.name === this.name) {/*ตอนแรกเช็คแค่ element อย่างเดียว*/
                overlayTypes.removeAt(i);
                break;
            }
        }

        this.tiles = [];


    };
    /*
     * Change opacity on demand.
     */
    this.setOpacity = function (opacity) {
        console.log('this :>> ', this);
        this.options['opacity'] = opacity;

        if (this.type == "geoserver" || this.type == "arcgisimageserver" || this.type == null) {
            for (var i in this.tiles) {
                this.tiles[i].style.opacity = opacity;

            }
        } else {
            this.arcgis.setOpacity(opacity);
            // console.log("opacityset");
        }
    }
    this.zoomwmsnew = (map) => {
        if (this.type == "geoserver" || this.type == "arcgisimageserver" || this.type == null) {
            this.zoomToWms(map);
        } else {
            this.ZoomToArcgis(map);
        }
    }
    this.zoomToWms = function (map) {

        // if (!this.params['layers'].length) {
        // if (!this.params['layers'].length) {
        if (!this.params['layers']) {
            console.log("[WmsMapType] Required param 'layers' is empty");
            this.params['layers'] = '0';
            // return;
        }
        var url = this.url + "?";


        url += "service=" + this.params['service'] + "&";
        url += "version=" + this.params['version'] + "&";
        url += "request=" + "GetCapabilities" + "&";

        var isLayerNamespace = false;
        if (this.params['layers'].indexOf(':') > -1) {
            var tmpNamepace = this.params['layers'].split(':');
            if (tmpNamepace.length > 1) {
                url += "namespace=" + tmpNamepace[0] + "&";
                isLayerNamespace = true;
            }
        }

        if (!isLayerNamespace) {
            url += "namespace=" + this.params['layers'] + "&";
        }

        if (this.options['cache'] == false) {
            var date = new Date();
            url += "&cache=" + date.getTime();
        }

        var thisWms = this;
        url = encodeURIComponent(url);

        GetWmsBoundary(url, this.params['layers'], map);

    };

    this.zoomToWmsSwipe = function (map) { /*-------------------- Zooomtowms ชองหน้า Swipe map----------------*/

        // if (!this.params['layers'].length) {
        if (!this.params['layers']) {
            console.log("[WmsMapType] Required param 'layers' is empty");
            return;
        }
        var url = this.url + "?";


        url += "service=" + this.params['service'] + "&";
        url += "version=" + this.params['version'] + "&";
        url += "request=" + "GetCapabilities" + "&";

        var isLayerNamespace = false;
        if (this.params['layers'].indexOf(':') > -1) {
            var tmpNamepace = this.params['layers'].split(':');
            if (tmpNamepace.length > 1) {
                url += "namespace=" + tmpNamepace[0] + "&";
                isLayerNamespace = true;
            }
        }

        if (!isLayerNamespace) {
            url += "namespace=" + this.params['layers'] + "&";
        }

        if (this.options['cache'] == false) {
            var date = new Date();
            url += "&cache=" + date.getTime();
        }

        var thisWms = this;
        url = encodeURIComponent(url);


        //console.log(angular.element('#ang-controller').scope())
        //console.log(url, this.params['layers'])
        //$('#map-left').scope().GetWmsBoundary(url, this.params['layers']);
        return {
            url: url,
            param: this.params['layers']
        }
    }


    this.Arcgiswms = async function (map, index) {/*------------------------------------Arcgis wms addnew---------------------------*/
        // var url = this.url+this.params.layers+"/MapServer";
        var url = this.url;
        var agsType = await new gmaps.ags.MapType(url, {
            name: this.name,
            opacity: 1,
        });
        // console.log('agsType :>> ', agsType);
        this.arcgis = agsType;
        map.overlayMapTypes.insertAt(map.overlayMapTypes.getLength(), agsType);






    }
    this.GetLayerWMS = async function () {
        // console.log('this.GetCapabilities :>> ', this.urlwms + "?request=GetCapabilities&service=WMS");
        let urlset = decodeURIComponent(this.urlwms + "?request=GetCapabilities&service=WMS")
        let layerURL = await getHTML(urlset);
        function getHTML(url) {
            return new Promise(function (resolve, reject) {
                var x = new XMLHttpRequest();
                x.open("GET", url, true);
                x.onreadystatechange = async function () {
                    if (x.readyState == 4 && x.status == 200) {
                        let html = x.response;
                        // console.log('html :>> ', html);
                        if (html != "" & html != null && html.indexOf('version') > -1) {
                            var wmsData = new WMSCapabilities().parse(html);
                            // if (wmsData != null && wmsData.Capability != null && wmsData.Capability.Layer != null && wmsData.Capability.Layer.Layer != null) {
                            if (wmsData != null && wmsData.Capability != null && wmsData.Capability.Layer != null) {
                                var layerList = wmsData.Capability.Layer.Layer ?? wmsData.Capability.Layer;
                                // console.log('layerList :>> ', layerList);
                                resolve(layerList[0])
                            }
                        }
                    }
                }
                x.onerror = function () {
                    reject({
                        status: x.status,
                        statusText: x.statusText
                    });
                };
                x.send(null);
            });
        }


        // console.log('layerURL :>> ', layerURL);
        return layerURL.Name ? layerURL.Name : 0;
    }

    this.GetfeatureData = async function (event, map) {
        // function latLonToXY(lat, lon, zoom) {
        //     // Convert to radians
        //     lat = lat * Math.PI / 180;
        //     lon = lon * Math.PI / 180;

        //     var circumference = 256 * Math.pow(2, zoom);
        //     var falseEasting = circumference / 2.0;
        //     var falseNorthing = circumference / 2.0;
        //     var radius = circumference / (2 * Math.PI);

        //     var point = {
        //         y: radius / 2.0 * Math.log((1.0 + Math.sin(lat)) / (1.0 - Math.sin(lat))),
        //         x: radius * lon
        //     };

        //     point.x = falseEasting + point.x;
        //     point.y = falseNorthing - point.y;

        //     return point;
        // }
        // function getTileCoordinates(lat, lon, zoom) {
        //     var self = this;
        //     var point = latLonToXY(lat, lon, zoom);

        //     var tileXY = {
        //         x: Math.floor(point.x / 256),
        //         y: Math.floor(point.y / 256)
        //     };

        //     return tileXY;
        // }
        // function latLonToTileXYOffset(lat, lon, zoom) {
        //     var point = latLonToXY(lat, lon, zoom);

        //     var tileOffset = {
        //         x: point.x % 256,
        //         y: point.y % 256
        //     };

        //     return tileOffset;
        // }
        // function getTileBoundingBox(map, tileCoords) {
        //     var projection = map.getProjection();
        //     var zpow = Math.pow(2, map.getZoom());

        //     var ul = new google.maps.Point(tileCoords.x * 256.0 / zpow, (tileCoords.y + 1) * 256.0 / zpow);
        //     var lr = new google.maps.Point((tileCoords.x + 1) * 256.0 / zpow, (tileCoords.y) * 256.0 / zpow);
        //     var ulw = projection.fromPointToLatLng(ul);
        //     var lrw = projection.fromPointToLatLng(lr);
        //     var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();

        //     var bbox = {
        //         latMin: ulw.lat(),
        //         latMax: lrw.lat(),
        //         lonMin: ulw.lng(),
        //         lonMax: lrw.lng()
        //     };

        //     return bbox;
        // }
        // var tileCoords = getTileCoordinates(event.latLng.lat(), event.latLng.lng(), map.getZoom());
        // var tileBounds = getTileBoundingBox(map, tileCoords)
        // var tileXYOffset = latLonToTileXYOffset(event.latLng.lat(), event.latLng.lng(), map.getZoom())

        // let urlwms = `${this.urlwms}?service=WMS&version=${this.params.version}&request=GetFeatureInfo&layers=0&query_layers=0&exceptions=application/vnd.ogc.se_inimage&x=128&y=128&bbox=${tileBounds.latMin + "," + tileBounds.lonMin + "," + tileBounds.latMax + "," + tileBounds.lonMax}&width=256&height=256&crs=${this.params.crs}&srs=${this.params.srs}&info_format=text/html&transparent=true&feature_count=50`
        // var getFeatureInfoUrl = `${this.urlwms}?service=WMS&version=${this.params.version}&request=GetFeatureInfo&srs=${this.params.srs}&CRS=${this.params.crs}&INFO_FORMAT=text/html&QUERY_LAYERS=0,1,2,4,5,7,8,10,11,13,14,17,18,20,21,24,25,27,28,31,32,34,35,38,39,41,42`;
        // getFeatureInfoUrl += "&BBOX=" + tileBounds.latMin + "," + tileBounds.lonMin + "," + tileBounds.latMax + "," + tileBounds.lonMax;
        // getFeatureInfoUrl += "&I=" + tileXYOffset.x + "&J=" + tileXYOffset.y + "&WIDTH=256&HEIGHT=256";
        // let urljson = `https://pttarcgisserver.pttplc.com/arcgis/rest/services/PTT_LMA/Publish_Service_LMA/MapServer/0/query?f=json&where=(1=1) AND (1=1)&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry={"xmin":${tileBounds.latMin},"ymin":${tileBounds.lonMin},"xmax":${tileBounds.latMax},"ymax":${tileBounds.lonMax},"spatialReference":{"wkid":102100,"latestWkid":3857}}&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100`
        // console.log(urljson);
        // console.log('this :>> ', this);
        // console.log('bbox :>> ', tileBounds.latMin + "," + tileBounds.lonMin + "," + tileBounds.latMax + "," + tileBounds.lonMax);


        function fromLatLngToPoint(latLng, map) {
            var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
            var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
            var scale = Math.pow(2, map.getZoom());
            var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
            return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
        }


        function getRadius(zoom) {
            var radius_px = 0.40 / 2
            var constMetersDegress = 1000; // TODO Verifiy

            //zoom <-> m/px = http://timwhitlock.info/blog/2010/04/google-maps-zoom-scales/
            var scaled_zooms = {
                22: 0.02,
                21: 0.04,
                20: 0.09,
                19: 0.19,
                18: 0.37,
                17: 0.74,
                16: 1.48,
                15: 3,
                14: 6,
                13: 12,
                12: 24,
                11: 48,
                10: 95,
                9: 190,
                8: 378,
                7: 752,
                6: 1485,
                5: 2909,
                4: 5540,
                3: 10064,
                2: 16355,
                1: 21282,
                0: 30000
            }

            var radius_meters = radius_px * scaled_zooms[zoom];
            var radius_degrees = radius_meters / constMetersDegress;
            return radius_degrees;
        }



        // function getFeatureInfoURL(latLng, url) {
        var lat = parseFloat(event.latLng.lat());
        var lng = parseFloat(event.latLng.lng());

        //console.info('------------------------------')
        var radius_degrees = getRadius(map.getZoom());
        var buffer_sw_y_dd = lat - radius_degrees
        var buffer_sw_x_dd = lng - radius_degrees
        var buffer_ne_y_dd = lat + radius_degrees
        var buffer_ne_x_dd = lng + radius_degrees
        //console.info('bbox dd',buffer_sw_x_dd+','+buffer_sw_y_dd+','+buffer_ne_x_dd+','+buffer_ne_y_dd)

        var buffer_sw_dd = new google.maps.LatLng(buffer_sw_y_dd, buffer_sw_x_dd)//decimal degrees
        var buffer_ne_dd = new google.maps.LatLng(buffer_ne_y_dd, buffer_ne_x_dd)//decimal degrees

        var buffer_sw_px = fromLatLngToPoint(buffer_sw_dd, map);//pixels
        var buffer_ne_px = fromLatLngToPoint(buffer_ne_dd, map);//pixels
        //console.info('buffer_sw_px',buffer_sw_px,'buffer_ne_px',buffer_ne_px)

        var buffer_width_px = (Math.abs(buffer_ne_px.x - buffer_sw_px.x)).toFixed(0);
        var buffer_height_px = (Math.abs(buffer_ne_px.y - buffer_sw_px.y)).toFixed(0);
        //console.info('buffer_width_px',buffer_width_px, 'buffer_height_px',buffer_height_px)

        var center_x_px = (buffer_width_px / 2).toFixed(0);
        var center_y_px = (buffer_height_px / 2).toFixed(0);
        //console.info('center_x_px',center_x_px,'center_y_px',center_y_px)
        //console.info('------------------------------')

        let layers = await this.GetLayerWMS();
        var url = this.urlwms + '?';
        url += '&SERVICE=WMS';
        // url += '&VERSION=1.3.0';
        url += '&VERSION=1.1.1';
        url += '&REQUEST=GetFeatureInfo';
        url += '&TRANSPARENT=true';
        url += '&QUERY_LAYERS=' + layers;
        url += '&STYLES';
        url += '&LAYERS=' + layers;
        url += '&INFO_FORMAT=text/html';
        // url += '&INFO_FORMAT=text/javascript';
        url += '&SRS=EPSG:6706';
        url += '&crs=EPSG:6706';
        url += '&WIDTH=' + buffer_width_px;
        url += '&HEIGHT=' + buffer_height_px;
        url += '&J=' + center_y_px;
        url += '&I=' + center_x_px;
        url += '&BBOX=' + buffer_sw_x_dd + ',' + buffer_sw_y_dd + ',' + buffer_ne_x_dd + ',' + buffer_ne_y_dd;

        let result = await fetch(url).then(response => response.text()).then((html) => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            var feature = doc.querySelector('table');
            if (feature) {
                return html
            } else {
                return null
            }

        }).catch((error) => {
            console.log('errorwmsfeature :>> ', error);
            return null;
        });
        return result;
        // };

        // getFeatureInfoURL(event.latLng, this.urlwms)


    }
    this.ZoomToArcgis = function (map) {/*------------------------------------Arcgis wms addnew---------------------------*/

        var url = this.url;
        $.getJSON(`${url}/info/iteminfo?f=pjson`, function (result) {
            // $.getJSON(`${url}/queryBoundary?outSR=4326&f=pjson`, function (result) {
            //     console.log('result :>> ', result);
            //     let lat = result.shape.ymin;
            //     let lng = result.shape.xmin;
            //     let lat2 = result.shape.ymax;
            //     let lng2 = result.shape.xmax;
            //     var bounds = new google.maps.LatLngBounds();
            //     var points = [
            //         new google.maps.LatLng(lat, lng),
            //         new google.maps.LatLng(lat2, lng2)
            //     ];
            //     // Extend bounds with each point
            //     for (var i = 0; i < points.length; i++) {
            //         bounds.extend(points[i]);
            //         //new google.maps.Marker({ position: points[i], map: map });
            //     }
            //     /*  var pt = new google.maps.LatLng(lat,lng);
            //      bounds.extend(pt); */
            //     map.fitBounds(bounds);


            let lat = result.extent[0][1];
            let lng = result.extent[0][0];
            let lat2 = result.extent[1][1];
            let lng2 = result.extent[1][0];
            var bounds = new google.maps.LatLngBounds();
            var points = [
                new google.maps.LatLng(lat, lng),
                new google.maps.LatLng(lat2, lng2)
            ];
            // Extend bounds with each point
            for (var i = 0; i < points.length; i++) {
                bounds.extend(points[i]);
                //new google.maps.Marker({ position: points[i], map: map });
            }
            /*  var pt = new google.maps.LatLng(lat,lng);
             bounds.extend(pt); */
            map.fitBounds(bounds);
        });
    }

    /*---------------------------------------------------------------------------------------------------------------------*/

    /*
     * ---------------
     * Private methods
     * ---------------
     */

    /*
     * Return the tile bounds for the given x, y, z values.
     */

    /*---------------------------------------------------------------------------------------------------------------------*/
    function GetWmsBoundary(url, layerName, map) {

        if (url != null && url != "") {
            let urlset = decodeURIComponent(url)
            // urlset = urlset.replace(/^http:\/\//i, 'https://');
            var data = {};
            data.url = url;

            var x = new XMLHttpRequest();
            x.open("GET", urlset, true);
            x.onreadystatechange = function () {
                if (x.readyState == 4 && x.status == 200) {
                    let html = x.response;
                    // console.log('html :>> ', html);
                    if (html != "" & html != null && html.indexOf('version') > -1) {
                        var wmsData = new WMSCapabilities().parse(html);
                        // if (wmsData != null && wmsData.Capability != null && wmsData.Capability.Layer != null && wmsData.Capability.Layer.Layer != null) {
                        if (wmsData != null && wmsData.Capability != null && wmsData.Capability.Layer != null) {
                            var layerList = wmsData.Capability.Layer.Layer ?? wmsData.Capability.Layer;
                            if (Array.isArray(layerList)) {
                                for (var i = 0; i < layerList.length; ++i) {
                                    if (layerList[i].Name == layerName || layerList[i].Title == layerName) {
                                        if (layerList[i].LatLonBoundingBox != null) {
                                            //return layerList[i].LatLonBoundingBox;
                                            console.log('layerList[i].LatLonBoundingBox  :>> ', layerList[i]);
                                            var bounds = new google.maps.LatLngBounds(
                                                new google.maps.LatLng(layerList[i].LatLonBoundingBox[1], layerList[i].LatLonBoundingBox[0]),
                                                new google.maps.LatLng(layerList[i].LatLonBoundingBox[3], layerList[i].LatLonBoundingBox[2])
                                            );

                                            var center = bounds.getCenter();

                                            map.fitBounds(bounds);
                                            return;
                                        } else {
                                            console.log('boundaryError');
                                        }
                                    }
                                }
                            } else {
                                if (layerList.Name == layerName || layerList.Title == layerName) {
                                    if (layerList.BoundingBox != null) {
                                        let layerbox = layerList.BoundingBox;
                                        for (let i = 0; i < layerbox.length; i++) {
                                            if (layerbox[i].crs == 'EPSG:4326') {
                                                // console.log('layerbox[i] :>> ', layerbox[i]);
                                                var bounds = new google.maps.LatLngBounds(
                                                    new google.maps.LatLng(layerbox[i].extent[0], layerbox[i].extent[1]),
                                                    new google.maps.LatLng(layerbox[i].extent[2], layerbox[i].extent[3])
                                                );
                                                map.fitBounds(bounds);
                                                return;
                                            }
                                        }

                                    } else {
                                        console.log('boundaryError');
                                    }
                                }

                            }
                        }
                    }
                }
            };
            x.send(null);

        }
    }

    function getBounds(x, y, z) {
        y = Math.pow(2, z) - y - 1; // Translate Y value

        var resolution = (CIRCUMFERENCE / TILE_SIZE) / Math.pow(2, z); // meters per pixel

        var swPoint = getMercatorCoord(x, y, resolution);
        var nePoint = getMercatorCoord(x + 1, y + 1, resolution);

        var bounds = {
            swX: swPoint.x,
            swY: swPoint.y,
            neX: nePoint.x,
            neY: nePoint.y
        };

        return bounds;
    };

    /*
     * Translate the xy & resolution to spherical mercator (EPSG:3857, EPSG:900913).
     */
    function getMercatorCoord(x, y, resolution) {
        var point = {
            x: x * TILE_SIZE * resolution - CIRCUMFERENCE / 2.0,
            y: y * TILE_SIZE * resolution - CIRCUMFERENCE / 2.0
        };

        return point;
    };
}