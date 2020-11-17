import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationMenu from './src/components/menus/NavigationMenu';

import translate from './src/components/translator/translationUtil';

const Stack = createStackNavigator();

/**
 * @description The main App container that gets imported onto the intial page render. This begins the start of the tree.
 * 
 * @returns {React.ReactNode}
 */
function App() {
    const navigatorOptions = {
        screenOptions: {
            headerShown: false
        }
    };
    
    return (
        <NavigationContainer>
            <Stack.Navigator {...navigatorOptions}>
                <Stack.Screen name={translate('explore')} component={NavigationMenu} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent('App', () => App);

export default App;