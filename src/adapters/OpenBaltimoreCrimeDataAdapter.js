import { useSelector } from 'react-redux';
import TimeUtil from '../utils/TimeUtil';

class OpenBaltimoreCrimeDataAdapter {
    constructor() {
        this.timeUtil = new TimeUtil();
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
                }
            }, []);

        return {
            count: response.count || 0,
            results: parsedResults
        };
    }

    formatFilters(filters) {
        const filtersString = Object.keys(filters).reduce((acc, currentFilter) => {
            let filterString = null;

            if(filters[currentFilter].length) {
                const selectedValues = filters[currentFilter].map((value) => {
                    return `'${value}'`;
                }).join(', ');

                if(currentFilter === 'crimedatetime') {
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

        if(filtersString.length) {
            parsedFilters = filtersString.join(' AND ');
        } else { 
            parsedFilters = '1=1'
        }

        return parsedFilters;
    }

    getFilters() {
        const translations = useSelector(state => state.translations),
            today = this.timeUtil.getTodayStart(),
            thisWeek = this.timeUtil.getWeekStart(),
            thisMonth = this.timeUtil.getMonthStart(),
            thisYear = this.timeUtil.getYearStart();

        return {
            description: [
                {
                    id: 'AGG. ASSAULT',
                    name: translations['aggravatedassault']
                },
                {
                    id: 'AUTO THEFT',
                    name: translations['autotheft']
                },
                {
                    id: 'ARSON',
                    name: translations['arson']
                },
                {
                    id: 'BURGLARY',
                    name: translations['burglary']
                },
                {
                    id: 'COMMON ASSAULT',
                    name: translations['commonassault']
                },
                {
                    id: 'HOMICIDE',
                    name: translations['homicide']
                },
                {
                    id: 'LARCENY',
                    name: translations['larceny']
                },
                {
                    id: 'LARCENY FROM AUTO',
                    name: translations['larcenyauto']
                },
                {
                    id: 'RAPE',
                    name: translations['rape']
                },
                {
                    id: 'ROBBERY - CARJACKING',
                    name: translations['robberycar']
                },
                {
                    id: 'ROBBERY - COMMERCIAL',
                    name: translations['robberycommercial']
                },
                {
                    id: 'ROBBERY - RESIDENCE',
                    name: translations['robberyresidence']
                },
                {
                    id: 'ROBBERY - STREET',
                    name: translations['robberystreet']
                },
                {
                    id: 'SHOOTING',
                    name: translations['shooting']
                }
            ],
            weapon: [
                {
                    id: 'FIRE',
                    name: translations['fire']
                },
                {
                    id: 'FIREARM',
                    name: translations['firearm']
                },
                {
                    id: 'HANDS',
                    name: translations['hands']
                },
                {
                    id: 'KNIFE',
                    name: translations['knife']
                },
                {
                    id: 'NA',
                    name: translations['na']
                },
                {
                    id: 'OTHER',
                    name: translations['other']
                }
            ],
            crimedatetime: [
                {
                    id: today,
                    name: translations['today']
                },
                {
                    id: thisWeek,
                    name: translations['thisweek']
                },
                {
                    id: thisMonth,
                    name: translations['thismonth']
                },
                {
                    id: thisYear,
                    name: translations['thisyear']
                }
            ]
        }
    }
}

export default OpenBaltimoreCrimeDataAdapter;