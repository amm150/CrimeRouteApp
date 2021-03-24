import QueryBuilder from './QueryBuilder';
import OpenBaltimoreCrimeDataAdapter from '../adapters/OpenBaltimoreCrimeDataAdapter';

class OpenBaltimoreDataHandler {
    constructor() {
        this.domain = 'https://data.baltimorecity.gov';

        this.queryBuilder = new QueryBuilder();
        this.adapter = new OpenBaltimoreCrimeDataAdapter();
    }

    getCrimeCounts(postData = {}, field) {
        const filterString = this.adapter.formatFilters(postData.filters),
            queryData = {
                ...postData,
                where: filterString
            };

        delete queryData.filters;

        const queryString = this.queryBuilder.buildQueryString(queryData);

        return fetch(`https://egis.baltimorecity.gov/egis/rest/services/GeoSpatialized_Tables/Part1_Crime/FeatureServer/0/query${queryString}`, {
            credentials: 'omit',
            method: 'GET'
        }).then((response) => {
            return response.json().then((resp) => {
                return this.adapter.formatCrimeCountData(resp, field);
            });
        }).catch(() => {
            // Error fetching the data
        });
    }

    getCrimeData(postData = {}) {
        const filterString = this.adapter.formatFilters(postData.filters),
            queryData = {
                ...postData,
                where: filterString
            };

        delete queryData.filters;

        const queryString = this.queryBuilder.buildQueryString(queryData);

        return fetch(`https://egis.baltimorecity.gov/egis/rest/services/GeoSpatialized_Tables/Part1_Crime/FeatureServer/0/query${queryString}`, {
            credentials: 'omit',
            method: 'GET'
        }).then((response) => {
            return response.json().then((resp) => {
                return this.adapter.formatCrimeData(resp);
            });
        }).catch(() => {
            // Error fetching the data
        });
    }
}

export default OpenBaltimoreDataHandler;