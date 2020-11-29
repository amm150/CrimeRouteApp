import React from 'react';
import { AppRegistry } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider as StoreProvider } from 'react-redux';
import store from './src/redux/store';

import ConnectedApp from './src/ConnectedApp';

/**
 * @description The main App container that gets imported onto the intial page render. This begins the start of the tree.
 * 
 * @returns {React.ReactNode}
 */
function App() {
    return (
        <StoreProvider store={store}>
            <SafeAreaProvider>
                <ConnectedApp />
            </SafeAreaProvider>
        </StoreProvider>
    );
}

AppRegistry.registerComponent('App', () => App);

export default App;