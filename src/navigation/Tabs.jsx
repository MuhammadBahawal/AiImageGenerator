import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Home from '../Screens/Home';
import Result from '../Screens/Result';
import FaceSwap from '../Screens/FaceSwap';
import FaceSwapUpload from '../Screens/FaceSwapUpload';
import FaceSwapResult from '../Screens/FaceSwapResult';
import FaceSwapCategory from '../Screens/FaceSwapCategory';
import History from '../Screens/History';

const Tab = createBottomTabNavigator();
const ImageStack = createNativeStackNavigator();
const FaceSwapStack = createNativeStackNavigator();

const TAB_ICONS = {
  'Face Swap': require('../../assets/images/bottombaricons/faceswapIcon.png'),
  Image: require('../../assets/images/bottombaricons/imageIcon.png'),
  History: require('../../assets/images/bottombaricons/historyIcon.png'),
};

const BASE_TAB_STYLE = {
  position: 'absolute',
  left: 18,
  right: 18,
  bottom: 18,
  height: 64,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflow: 'hidden',
  backgroundColor: '#242424',
  borderTopWidth: 0,

  // shadow
  elevation: 8, // android
  shadowColor: '#000', // ios
  shadowOpacity: 0.25,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 6 },
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
});

const getHiddenStyle = (route, hiddenRoutes, tabBarStyle) => {
  const focusedRoute = getFocusedRouteNameFromRoute(route) ?? route?.name;
  if (hiddenRoutes.includes(focusedRoute)) {
    return { display: 'none' };
  }
  return tabBarStyle;
};

function ImageStackScreen() {
  return (
    <ImageStack.Navigator screenOptions={{ headerShown: false }}>
      <ImageStack.Screen name="Home" component={Home} />
      <ImageStack.Screen name="Result" component={Result} />
    </ImageStack.Navigator>
  );
}

function FaceSwapStackScreen() {
  return (
    <FaceSwapStack.Navigator screenOptions={{ headerShown: false }}>
      <FaceSwapStack.Screen name="FaceSwapHome" component={FaceSwap} />
      <FaceSwapStack.Screen
        name="FaceSwapCategory"
        component={FaceSwapCategory}
      />
      <FaceSwapStack.Screen name="FaceSwapUpload" component={FaceSwapUpload} />
      <FaceSwapStack.Screen name="FaceSwapResult" component={FaceSwapResult} />
    </FaceSwapStack.Navigator>
  );
}

export default function Tabs() {
  const insets = useSafeAreaInsets();
  const tabBarStyle = {
    ...BASE_TAB_STYLE,
    bottom: Math.max(insets.bottom + 0),
  };

  return (
    <Tab.Navigator
      initialRouteName="Image"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle,
        tabBarItemStyle: {
          paddingVertical: 10,
          paddingHorizontal: 6,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },

        tabBarActiveTintColor: '#F5B301', // yellow
        tabBarInactiveTintColor: '#A7A7A7', // grey

        //  icons
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color, focused }) => {
          const icon = TAB_ICONS[route.name];
          if (icon) {
            return (
              <Image
                source={icon}
                resizeMode="contain"
                style={[styles.tabIcon, { tintColor: color }]}
              />
            );
          }

          return (
            <Ionicons
              name={focused ? 'image' : 'image-outline'}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Face Swap"
        component={FaceSwapStackScreen}
        options={({ route }) => ({
          tabBarStyle: getHiddenStyle(route, [
            'FaceSwapUpload',
            'FaceSwapResult',
            'FaceSwapCategory',
          ], tabBarStyle),
        })}
      />
      <Tab.Screen
        name="Image"
        component={ImageStackScreen}
        options={({ route }) => ({
          tabBarStyle: getHiddenStyle(route, ['Result'], tabBarStyle),
        })}
      />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
  );
}
