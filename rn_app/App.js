import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Header from './Shared/Header';
import ProductContainer from './Screens/Products/ProductContainer';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Header />
        <ProductContainer />
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
