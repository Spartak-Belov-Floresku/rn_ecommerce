import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';
import store from './Redux/store';

import Main from './Navigators/Main';

import Header from './Shared/Header';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <NativeBaseProvider>
          <Header />
          <Main />
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
}

