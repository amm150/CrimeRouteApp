class TimeUtil {
    convertMilitaryTimeToStandard(militaryTime) {
        const timeArray = militaryTime.split(':'),
            hour = timeArray[0],
            minute = timeArray[1],
            second = timeArray[2],
            isPM = (hour.charAt(0) == 1 && hour.charAt(1) > 2) || hour.charAt(0) == 2;

        return isPM ? `${hour - 12}:${minute}:${second} PM` : `${hour.charAt(0) == 0 ? hour.charAt(1) : hour}:${minute}:${second} AM`;
    }
}

export default TimeUtil;