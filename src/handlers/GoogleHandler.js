import { google } from '../consts/apiKeys';
import GoogleMapsUtil from '../utils/GoogleMapsUtil';
import QueryBuilder from './QueryBuilder';

class GoogleHandler {
    constructor() {
        this.domain = 'https://maps.googleapis.com/';

        this.queryBuilder = new QueryBuilder();
        this.googleMapsUtil = new GoogleMapsUtil();
    }

    // getDirections(postData, crimes) {
    //     const avoidCoordinates = this.googleMapsUtil.getAvoidAreas(crimes),
    //         data = {
    //             apiKey: 'uzvyUNguCuA8PxEiF_mUI_brUtm0PjgTRcU7l7SQflg',
    //             app_id: 'k2skDXoXJ2Q4vTrurCiL',
    //             mode: 'fastest;pedestrian',
    //             waypoint0: `geo!${postData.origin.latitude},${postData.origin.longitude}`,
    //             waypoint1: `geo!${postData.destination.latitude},${postData.destination.longitude}`,
    //             avoidareas: avoidCoordinates
    //         },
    //         queryString = this.queryBuilder.buildQueryString(data);


    //     return fetch(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json${queryString}`, {
    //         credentials: 'omit',
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then((response) => {
    //         return response.json();
    //     })
    //     .then((resp) => {
    //         console.log(resp);
    //         return resp.response.route[0].leg[0].maneuver.reduce((acc, item) => {
    //             const newCoords = [
    //                 {
    //                     latitude: item.position.latitude,
    //                     longitude: item.position.longitude
    //                 }
    //             ];

    //             return [...acc, ...newCoords];
    //         }, []);
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });
    // }

    getDirections(postData) {
        const data = {
            ...postData,
            key: google
        },
        queryString = this.queryBuilder.buildQueryString(data);

        return fetch(`${this.domain}maps/api/directions/json${queryString}`, {
            credentials: 'omit',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((resp) => {
            return this.googleMapsUtil.parseDirections(resp);
        })
        .catch((err) => {
            console.error(err);
        });
    }

    getAutocompleteAddresses(postData = {}) {
        const data = {
                ...postData,
                key: google
            },
            queryString = this.queryBuilder.buildQueryString(data);

        return fetch(`${this.domain}maps/api/place/autocomplete/json${queryString}`, {
                credentials: 'omit',
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                return resp;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    getPlaceDetails(postData = {}) {
        const data = {
                ...postData,
                key: google
            },
            queryString = this.queryBuilder.buildQueryString(data);

        return fetch(`${this.domain}maps/api/place/details/json${queryString}`)
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                return resp;
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

export default GoogleHandler;