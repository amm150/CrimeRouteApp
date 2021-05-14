import store from '../redux/store';
import TimeUtil from '../utils/TimeUtil';

const state = store.getState();

class OpenBaltimoreCrimeDataAdapter {
    constructor() {
        this.timeUtil = new TimeUtil();
    }

    formatCrimeCountData(response, field) {
        const results = response.features || [],
            parsedResults = results.map((data) => {
                let itemData = {};

                if (data.attributes[field] !== null) {
                    itemData = {
                        name: data.attributes[field],
                        value: data.attributes[`${field}CrimeCount`]
                    };
                }

                return itemData;
            }, []);

        return {
            results: parsedResults
        };
    }

    formatCrimeData(response) {
        const results = response.features || [],
            parsedResults = results.map((data) => {
                return {
                    crimecode: data.attributes.CrimeCode,
                    crimedate: data.attributes.CrimeDateTime,
                    description: data.attributes.Description,
                    district: data.attributes.District,
                    geolocation: data.attributes.GeoLocation,
                    inside_outside: data.attributes.Inside_Outside,
                    location: data.attributes.Location,
                    latitude: data.attributes.Latitude,
                    longitude: data.attributes.Longitude,
                    neighborhood: data.attributes.Neighborhood,
                    objectid: data.attributes.ObjectId,
                    post: data.attributes.Post,
                    premise: data.attributes.Premise,
                    rowid: data.attributes.RowID,
                    total_incidents: data.attributes.Total_Incidents,
                    vriname: data.attributes.VRIName,
                    weapon: data.attributes.Weapon
                };
            }, []);

        return {
            count: response.count || 0,
            results: parsedResults
        };
    }

    formatFilters(filters) {
        const filterOptions = this.getFilters(),
            filtersString = Object.keys(filters).reduce((acc, currentFilter) => {
                let filterString = null;

                if (filters[currentFilter].length) {
                    const selectedValues = filters[currentFilter].map((value) => {
                        const selectedValue = filterOptions[currentFilter].find((filterOption) => {
                            return value === filterOption.id;
                        }).value;

                        return `'${selectedValue}'`;
                    }).join(', ');

                    if (currentFilter === 'crimedatetime') {
                        filterString = [...acc, `${currentFilter} >= ${selectedValues}`];
                    } else {
                        filterString = [...acc, `${currentFilter} IN (${selectedValues})`];
                    }
                } else {
                    filterString = [...acc];
                }

                return filterString;
            }, []);

        let parsedFilters;

        if (filtersString.length) {
            parsedFilters = filtersString.join(' AND ');
        } else {
            parsedFilters = '1=1';
        }

        return parsedFilters;
    }

    getFilters() {
        const today = this.timeUtil.getTodayStart(),
            thisWeek = this.timeUtil.getWeekStart(),
            thisMonth = this.timeUtil.getMonthStart(),
            thisYear = this.timeUtil.getYearStart();

        return {
            description: [
                {
                    id: 'AGG. ASSAULT',
                    name: state.translations['aggravatedassault'],
                    value: 'AGG. ASSAULT'
                },
                {
                    id: 'AUTO THEFT',
                    name: state.translations['autotheft'],
                    value: 'AUTO THEFT'
                },
                {
                    id: 'ARSON',
                    name: state.translations['arson'],
                    value: 'ARSON'
                },
                {
                    id: 'BURGLARY',
                    name: state.translations['burglary'],
                    value: 'BURGLARY'
                },
                {
                    id: 'COMMON ASSAULT',
                    name: state.translations['commonassault'],
                    value: 'COMMON ASSAULT'
                },
                {
                    id: 'HOMICIDE',
                    name: state.translations['homicide'],
                    value: 'HOMICIDE'
                },
                {
                    id: 'LARCENY',
                    name: state.translations['larceny'],
                    value: 'LARCENY'
                },
                {
                    id: 'LARCENY FROM AUTO',
                    name: state.translations['larcenyauto'],
                    value: 'LARCENY FROM AUTO'
                },
                {
                    id: 'RAPE',
                    name: state.translations['rape'],
                    value: 'RAPE'
                },
                {
                    id: 'ROBBERY - CARJACKING',
                    name: state.translations['robberycar'],
                    value: 'ROBBERY - CARJACKING'
                },
                {
                    id: 'ROBBERY - COMMERCIAL',
                    name: state.translations['robberycommercial'],
                    value: 'ROBBERY - COMMERCIAL'
                },
                {
                    id: 'ROBBERY - RESIDENCE',
                    name: state.translations['robberyresidence'],
                    value: 'ROBBERY - RESIDENCE'
                },
                {
                    id: 'ROBBERY - STREET',
                    name: state.translations['robberystreet'],
                    value: 'ROBBERY - STREET'
                },
                {
                    id: 'SHOOTING',
                    name: state.translations['shooting'],
                    value: 'SHOOTING'
                }
            ],
            weapon: [
                {
                    id: 'FIRE',
                    name: state.translations['fire'],
                    value: 'FIRE'
                },
                {
                    id: 'FIREARM',
                    name: state.translations['firearm'],
                    value: 'FIREARM'
                },
                {
                    id: 'HANDS',
                    name: state.translations['hands'],
                    value: 'HANDS'
                },
                {
                    id: 'KNIFE',
                    name: state.translations['knife'],
                    value: 'KNIFE'
                },
                {
                    id: 'NA',
                    name: state.translations['na'],
                    value: 'NA'
                },
                {
                    id: 'OTHER',
                    name: state.translations['other'],
                    value: 'OTHER'
                }
            ],
            crimedatetime: [
                {
                    id: 'today',
                    name: state.translations['today'],
                    value: today
                },
                {
                    id: 'thisweek',
                    name: state.translations['thisweek'],
                    value: thisWeek
                },
                {
                    id: 'thismonth',
                    name: state.translations['thismonth'],
                    value: thisMonth
                },
                {
                    id: 'thisyear',
                    name: state.translations['thisyear'],
                    value: thisYear
                }
            ]
        };
    }
}

export default OpenBaltimoreCrimeDataAdapter;