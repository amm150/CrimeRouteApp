import React, {
    useRef,
    useState,
    useReducer,
    useEffect
} from 'react';
import { ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationMenu from '../src/components/menus/NavigationMenu';
import DatabaseUtil from '../src/utils/DatabaseUtil';
import colors from './components/colors/colors';

import { connect } from 'react-redux';
import { updateLang } from './redux/actions';

const Stack = createStackNavigator();

/**
 * @description The main App container that gets imported onto the intial page render. This begins the start of the tree.
 * 
 * @returns {React.ReactNode}
 */
function ConnectedApp(props) {
    function buildApp() {
        const navigatorOptions = {
            screenOptions: {
                headerShown: false
            }
        };

        return (
            <NavigationContainer>
                <Stack.Navigator {...navigatorOptions}>
                    <Stack.Screen name={'explore'} component={NavigationMenu} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }

    function buildLoadingScreen() {
        return <ActivityIndicator size={'large'} color={colors.primary}/>
    }

    const database = useRef(new DatabaseUtil()).current,
        [initialized, setInitialized] = useState(false),
        markup = initialized ? buildApp() : buildLoadingScreen();

    if(!initialized) {
        database.getData('lang').then((lang) => {
            if(typeof(lang) !== 'undefined') {
                props.updateLang(lang);
            }
            
            setInitialized(true);
        });
    }

    return markup;
}

const mapStateToProps = (state) => {
    return { 
        lang: state.lang
    }
};

export default connect(mapStateToProps, { updateLang })(ConnectedApp);