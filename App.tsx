import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Home from './src/Screens/Home';

 function App() {
  return (
    <SafeAreaProvider >
      <SafeAreaView style={{flex: 1}}>
      <Home/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


export default App
