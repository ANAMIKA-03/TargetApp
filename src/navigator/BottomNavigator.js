import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../theme/color';

import Profile from '../screens/Profile/Profile';
import Home from '../screens/Home/Home';
import LeaderB from '../screens/LeaderB/LeaderB';
import Search from '../screens/Search/Search';
import CQuiz from '../screens/CQuiz/CQuiz';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../../assets/image/t1f.png') : require('../../assets/image/t1.png')}
              resizeMode="stretch"
              style={styles.icon}
            />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../../assets/image/t2f.png') : require('../../assets/image/t2.png')}
              resizeMode="stretch"
              style={[styles.icon, styles.searchIcon]}
            />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="CQuiz"
        component={CQuiz}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../../assets/image/t5.png')}
              resizeMode="stretch"
              style={styles.quizIcon}
            />
          ),
          headerShown: false,
          tabBarStyle: styles.hiddenTabBar,
        }}
      />

      <Tab.Screen
        name="LeaderB"
        component={LeaderB}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../../assets/image/t3f.png') : require('../../assets/image/t3.png')}
              resizeMode="stretch"
              style={styles.icon}
            />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../../assets/image/t4f.png') : require('../../assets/image/t4.png')}
              resizeMode="stretch"
              style={[styles.icon, styles.profileIcon]}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopColor: Colors.bord,
    paddingBottom: 8,
  },
  icon: {
    height: 26,
    width: 26,
    marginTop: 5,
  },
  searchIcon: {
    height: 24,
    width: 24,
  },
  quizIcon: {
    height: 120,
    width: 120,
    marginTop: -60,
  },
  hiddenTabBar: {
    display: 'none',
  },
  profileIcon: {
    height: 24,
    width: 24,
  },
});
