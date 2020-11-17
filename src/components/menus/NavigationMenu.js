import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ExploreContainer from '../../screens/explore/ExploreContainer';
import NewsContainer from '../../screens/news/NewsContainer';
import StatisticsContainer from '../../screens/statistics/StatisticsContainer';
import SettingsContainer from '../../screens/settings/SettingsContainer';

import MapIcon from '../icons/MapIcon';

import translate from '../translator/translationUtil';
import colors from '../colors/colors';

const Tab = createBottomTabNavigator();

/**
 * @description The main NavigationMenu container that gets imported onto the intial page render. This begins the start of the tree.
 * 
 * @returns {React.ReactNode}
 */
function NavigationMenu() {
    const navigationData = {
        initialRouteName: translate('explore'),
        screenOptions: ({ route }) => ({
            tabBarIcon: ({ focused }) => {
                let iconName;

                switch(route.name) {
                    case translate('explore'):
                        iconName = focused ? 'pin' : 'pin-outline';

                        break;

                    case translate('news'):
                        iconName = focused ? 'paper' : 'paper-outline';

                        break;

                    case translate('statistics'):
                        iconName = focused ? 'stats' : 'stats-outline';

                        break;

                    case translate('settings'):
                        iconName = focused ? 'settings' : 'settings-outline';

                        break;

                    default:
                        iconName = '';
                        break;
                }

                return (
                    <MapIcon />
                );
            }
        }),
        tabBarOptions: {
            activeTintColor: colors.primary,
            inactiveTintColor: colors.gray
        }  
    }

    return (
        <Tab.Navigator {...navigationData}>
            <Tab.Screen name={translate('explore')} component={ExploreContainer} />
            <Tab.Screen name={translate('news')} component={NewsContainer} />
            <Tab.Screen name={translate('statistics')} component={StatisticsContainer} />
            <Tab.Screen name={translate('settings')} component={SettingsContainer} />
        </Tab.Navigator>
    );
}

export default NavigationMenu;