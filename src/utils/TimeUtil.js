import { format, parseJSON } from 'date-fns';
import { LMS } from '../consts/dateFormats';

class TimeUtil {
    buildDateString(date = '', dateFormat = LMS) {
        const dateObject = new Date(parseJSON(date)),
            dateString = date && dateObject instanceof (Date) ? format(dateObject, dateFormat) : 'N/A';

        return dateString;
    }

    getTodayStart() {
        const today = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

        return today.toISOString();
    }

    getWeekStart() {
        const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return weekStart.toISOString();
    }

    getMonthStart() {
        const monthStart = new Date();

        monthStart.setMonth(monthStart.getMonth() - 1);

        monthStart.setHours(0, 0, 0, 0);

        return monthStart.toISOString();
    }

    getYearStart() {
        const yearStart = new Date();

        yearStart.setFullYear(yearStart.getFullYear() - 1);

        yearStart.setHours(0, 0, 0, 0);

        return yearStart.toISOString();
    }
}

export default TimeUtil;