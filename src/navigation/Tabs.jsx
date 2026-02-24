import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

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
  left: 0,
  right: 0,
  bottom: 0,
  height: 64,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflow: 'hidden',
  backgroundColor: '#121212',
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.08)',

  // shadow
  elevation: 14, // android
  shadowColor: '#000', // ios
  shadowOpacity: 0.32,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: -6 },
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

const renderTabBarBackground = () => (
  <LinearGradient
    colors={['#2A2A2A', '#1C1C1C', '#131313']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.tabBarBackground}
  />
);

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
  const safeBottom = Math.max(insets.bottom, 8);
  const tabBarStyle = {
    ...BASE_TAB_STYLE,
    height: 54 + safeBottom,
    paddingTop: 4,
    paddingBottom: safeBottom,
  };

  return (
    <Tab.Navigator
      initialRouteName="Image"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarBackground: renderTabBarBackground,

        tabBarStyle,
        tabBarItemStyle: {
          paddingVertical: 3,
          paddingHorizontal: 6,
        },
        tabBarIconStyle: {
          marginTop: -2,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
          fontWeight: '700',
          letterSpacing: 0.2,
          transform: [{ translateY: -1 }],
        },

        tabBarActiveTintColor: '#FFD248',
        tabBarInactiveTintColor: '#9A9A9A',

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
