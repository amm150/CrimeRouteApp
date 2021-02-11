import QueryBuilder from './QueryBuilder';
import OpenBaltimoreCrimeDataAdapter from '../adapters/OpenBaltimoreCrimeDataAdapter';

class OpenBaltimoreDataHandler {
    constructor() {
        this.domain = 'https://data.baltimorecity.gov';

        this.queryBuilder = new QueryBuilder();
        this.adapter = new OpenBaltimoreCrimeDataAdapter();
    }

    getCrimeData(postData = {}) {
        const filterString = this.adapter.formatFilters(postData.filters),
            queryData = {
                ...postData,
                where: filterString
            };

        delete queryData.filters;

        const queryString = this.queryBuilder.buildQueryString(queryData);

        return fetch(`https://services1.arcgis.com/UWYHeuuJISiGmgXx/ArcGIS/rest/services/Part_1_Crime_data/FeatureServer/0/query${queryString}`, {
            credentials: 'omit',
            method: 'GET'
        }).then((response) => {
            return response.json().then((resp) => {
                return this.adapter.formatCrimeData(resp);
            });
        }).catch((err) => {
            console.error(err);
        });
    }
}

export default OpenBaltimoreDataHandler;