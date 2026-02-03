import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

 function App() {
  return (
    <SafeAreaProvider >
      <SafeAreaView style={{flex: 1}}>
        <Text style = {{color:"red", backgroundColor:"black",fontSize:30}}>Hello world</Text>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}


export default App
