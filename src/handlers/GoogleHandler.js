import { google } from '../consts/apiKeys';
import QueryBuilder from './QueryBuilder';

class GoogleHandler {
    constructor() {
        this.domain = 'https://maps.googleapis.com/';

        this.queryBuilder = new QueryBuilder();
    }

    getAutocompleteAddresses(postData = {}) {
        const data = {
                ...postData,
                key: google
            },
            queryString = this.queryBuilder.buildQueryString(data);

        return fetch(`${this.domain}maps/api/place/autocomplete/json${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response)
            return response.json();
        }).catch((err) => {
            console.error(err);
        });
    }
}

export default GoogleHandler;