import React from 'react';
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ExploreContainer from '../../screens/explore/ExploreContainer';
import StatisticsContainer from '../../screens/statistics/StatisticsContainer';
import SettingsContainer from '../../screens/settings/SettingsContainer';

import Icon from '../icons/Icon';
import colors from '../colors/colors';

const Tab = createBottomTabNavigator();

/**
 * @description The main NavigationMenu container that gets imported onto the intial page render. This begins the start of the tree.
 * 
 * @returns {React.ReactNode}
 */
function NavigationMenu(props) {
    const navigationData = {
        initialRouteName: 'explore',
        screenOptions: ({ route }) => ({
            tabBarIcon: ({ focused }) => {
                const iconData = {
                    color: focused ? colors.primary : colors['dark-gray'],
                    name: route.name
                };

                return (
                    <Icon {...iconData}/>
                );
            },
            tabBarLabel: props.translations[route.name]
        }),
        tabBarOptions: {
            keyboardHidesTabBar: true,
            tabStyle: {
                padding: 1
            }
        }  
    }

    return (
        <Tab.Navigator {...navigationData}>
            <Tab.Screen name={'explore'} component={ExploreContainer} />
            <Tab.Screen name={'statistics'} component={StatisticsContainer} />
            <Tab.Screen name={'settings'} component={SettingsContainer} />
        </Tab.Navigator>
    );
}

const mapStateToProps = state => {
    return {
        translations: state.translations
    }
}

export default connect(mapStateToProps, { })(NavigationMenu);