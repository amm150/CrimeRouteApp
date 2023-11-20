import AsyncStorage from '@react-native-async-storage/async-storage';

class DatabaseUtil {
    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            console.error(e);
        }
    }

    getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if(value !== null) {
                return value;
            }
        } catch(e) {
            console.error(e);
        }
    }
}

export default DatabaseUtil;