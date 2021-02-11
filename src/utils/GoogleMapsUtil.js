class GoogleMapsUtil {
    parseDirections(data) {
        return {
            routes: data.routes.map((route) => {
                return {
                    route: this.decodePolyline(route.overview_polyline.points)
                };
            })
        }
    }
    
    /**
     * NOTE: Retrieved this directly from a thread on stack overflow (https://stackoverflow.com/a/35152804). This is needed to parse an encoded Polyline from google.
     * @param {*} encodedData 
     */
    decodePolyline(encodedData) {
        if (!encodedData) {
            return [];
        }
        var poly = [];
        var index = 0, len = encodedData.length;
        var lat = 0, lng = 0;
    
        while (index < len) {
            var b, shift = 0, result = 0;
    
            do {
                b = encodedData.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);
    
            var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lat += dlat;
    
            shift = 0;
            result = 0;
    
            do {
                b = encodedData.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);
    
            var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lng += dlng;
    
            var p = {
                latitude: lat / 1e5,
                longitude: lng / 1e5,
            };
            poly.push(p);
        }

        return poly;
    }
}

export default GoogleMapsUtil;