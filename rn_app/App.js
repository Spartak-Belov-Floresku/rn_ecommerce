import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Main from './Navigators/Main';

import Header from './Shared/Header';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Header />
        <Main />
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

