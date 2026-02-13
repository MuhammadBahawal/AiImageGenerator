import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Tabs from './src/navigation/Tabs';
import AllStyles from './src/Screens/AllStyles';
import Settings from './src/Screens/Settings';
import Premium from './src/Screens/Premium';
import { HistoryProvider } from './src/store/historyStore';
import { SubscriptionProvider } from './src/store/subscriptionStore';
import { SystemBars } from 'react-native-edge-to-edge';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <>
      <SystemBars style="light" />
      <SafeAreaProvider>
        <SubscriptionProvider>
          <HistoryProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/*  Bottom tab bar only here */}
                <Stack.Screen name="MainTabs" component={Tabs} />

                {/*  Navigate to this from your Styles component */}
                <Stack.Screen name="AllStyles" component={AllStyles} />

                <Stack.Screen
                  name="Settings"
                  component={Settings}
                  options={{ presentation: 'card' }}
                />
                <Stack.Screen
                  name="Premium"
                  component={Premium}
                  options={{ presentation: 'modal' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </HistoryProvider>
        </SubscriptionProvider>
      </SafeAreaProvider>
    </>
  );
}

export default App;
