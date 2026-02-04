import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Tabs from './src/navigation/Tabs';
import AllStyles from './src/Screens/AllStyles';
import Result from './src/Screens/Result'


const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/*  Bottom tab bar only here */}
          <Stack.Screen name="MainTabs" component={Tabs} />

          {/*  Navigate to this from your Styles component */}
          <Stack.Screen name="AllStyles" component={AllStyles} />
          <Stack.Screen name="Result" component={Result} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
