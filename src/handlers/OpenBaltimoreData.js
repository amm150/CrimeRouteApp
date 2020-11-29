import { open_baltimore } from '../consts/apiKeys';
import QueryBuilder from './QueryBuilder';

class OpenBaltimoreDataHandler {
    constructor() {
        this.domain = 'https://data.baltimorecity.gov';

        this.queryBuilder = new QueryBuilder();
    }

    getCrimeData(postData = {}) {
        const queryString = this.queryBuilder.buildQueryString(postData);

        return fetch(`${this.domain}/resource/wsfq-mvij.json${queryString}`, {
            credentials: 'omit',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-App-Token': open_baltimore
            }
        }).then((response) => {
            return response.json();
        }).catch((err) => {
            console.error(err);
        });
    }
}

export default OpenBaltimoreDataHandler;