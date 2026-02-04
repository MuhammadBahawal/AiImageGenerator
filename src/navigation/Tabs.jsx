import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../Screens/Home';
import FaceSwap from '../Screens/FaceSwap';
import History from '../Screens/History';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: 14,
          height: 72,
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
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
        },

        tabBarItemStyle: {
          paddingVertical: 10,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },

        tabBarActiveTintColor: '#F5B301',   // yellow
        tabBarInactiveTintColor: '#A7A7A7', // grey

        // ✅ icons
        tabBarIcon: ({ color, focused }) => {
          let iconName = 'image-outline';

          if (route.name === 'Face Swap') {
            iconName = focused ? 'happy' : 'happy-outline';
          } else if (route.name === 'Image') {
            iconName = focused ? 'image' : 'image-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Face Swap" component={FaceSwap} />
      <Tab.Screen name="Image" component={Home} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
  );
}
