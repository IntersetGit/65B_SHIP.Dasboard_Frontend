class WaGeojson {
    constructor() {
        // this.name = namefeature
    }
    async CleateGeojson(dataarray, type) {
        var geojson = {
            "name": this.name ?? "NewFeatureType",
            "type": "FeatureCollection",
            "features": []
        };
        let datafeature = dataarray.map((latlng) => {
            let vb = {
                "type": "Feature",
                "geometry": {
                    "type": type,
                    "coordinates": [latlng.longitude,latlng.latitude]
                },
                "properties": latlng
            }
            return vb;
        })
        geojson.features = datafeature;
        const blob = new Blob([JSON.stringify(geojson)], {
            type: "application/json"
        });

        // URL reference to the blob
        const url = URL.createObjectURL(blob);
        return url;

    }
}
export default WaGeojson