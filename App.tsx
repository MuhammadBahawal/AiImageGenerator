import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, Keyboard, Platform } from 'react-native';
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
import {
  disableImmersive,
  enableImmersive,
  IMMERSIVE_REAPPLY_DELAY_MS,
  scheduleImmersiveReapply as scheduleImmersiveReapplyNative,
} from './src/native/immersiveMode';

const Stack = createNativeStackNavigator();
const NAV_REAPPLY_DELAY_MS = 300;

function App() {
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const scheduleImmersiveReapply = useCallback(
    (delayMs = IMMERSIVE_REAPPLY_DELAY_MS) => {
      if (Platform.OS !== 'android') {
        return;
      }

      clearFallbackTimer();
      fallbackTimerRef.current = setTimeout(() => {
        enableImmersive();
      }, delayMs);

      scheduleImmersiveReapplyNative(delayMs);
    },
    [clearFallbackTimer],
  );

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    enableImmersive();
    scheduleImmersiveReapply(200);

    const appStateChangeSubscription = AppState.addEventListener(
      'change',
      nextState => {
        if (nextState === 'active') {
          scheduleImmersiveReapply(200);
        }
      },
    );
    const appFocusSubscription = AppState.addEventListener('focus', () => {
      scheduleImmersiveReapply(200);
    });
    const appBlurSubscription = AppState.addEventListener('blur', () => {
      disableImmersive();
    });

    const keyboardShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        disableImmersive();
      },
    );
    const keyboardHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        scheduleImmersiveReapply(250);
      },
    );

    return () => {
      appStateChangeSubscription.remove();
      appFocusSubscription.remove();
      appBlurSubscription.remove();
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
      clearFallbackTimer();
    };
  }, [clearFallbackTimer, scheduleImmersiveReapply]);

  return (
    <>
      <SystemBars style="light" />
      <SafeAreaProvider>
        <SubscriptionProvider>
          <HistoryProvider>
            <NavigationContainer
              onReady={() => {
                scheduleImmersiveReapply(200);
              }}
              onStateChange={() => {
                scheduleImmersiveReapply(NAV_REAPPLY_DELAY_MS);
              }}
            >
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
