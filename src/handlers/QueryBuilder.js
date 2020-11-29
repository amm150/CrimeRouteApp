class QueryBuilder {
    buildQueryString(postData) {
        return Object.keys(postData).reduce((accumulator, current) => {
            let queryString = accumulator;

            if(accumulator.length){
                queryString += `&${current}=${postData[current]}`
            } else {
                queryString += `?${current}=${postData[current]}`;
            }

            return queryString;
        }, '');
    }
}

export default QueryBuilder;