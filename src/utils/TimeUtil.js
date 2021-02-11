import { LMS } from "../consts/dateFormats";

import { format, parseJSON } from 'date-fns'

class TimeUtil {
    buildDateString(date = '', dateFormat = LMS) {
        const dateObject = new Date(parseJSON(date)),
            dateString = date && dateObject instanceof(Date) ? format(dateObject, dateFormat) : 'N/A';

        return dateString;
    }

    getTodayStart() {
        const today = new Date();

        today.setHours(0,0,0,0);

        return today.toISOString();
    }

    getWeekStart() {
        const weekStart = new Date();

        weekStart.setHours(0,0,0,0);

        const today = weekStart.getDay(),
            dateValue = weekStart.getDate() - today;

        weekStart.setDate(dateValue);

        return weekStart.toISOString();
    }

    getMonthStart() {
        const monthStart = new Date();

        monthStart.setHours(0,0,0,0);

        monthStart.setDate(1);

        return monthStart.toISOString();
    }

    getYearStart() {
        const yearStart = new Date();

        yearStart.setHours(0,0,0,0);
        yearStart.setMonth(0,1);

        return yearStart.toISOString();
    }
}

export default TimeUtil;