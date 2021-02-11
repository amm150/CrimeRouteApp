class QueryBuilder {
    buildQueryString(postData) {
        return Object.keys(postData).reduce((accumulator, current) => {
            let queryString = accumulator;

            const component = encodeURIComponent(postData[current]);

            if(accumulator.length){
                queryString += `&${current}=${component}`
            } else {
                queryString += `?${current}=${component}`;
            }

            return queryString;
        }, '');
    }
}

export default QueryBuilder;