import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Popular from './Popular';
import Trending from './Trending';
import Favorite from './Favorite';
import Mine from './Mine';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

const BottomTab = createBottomTabNavigator()

const Home = () => {
  return (
    <DynamicTabNavigator />
    // <BottomTab.Navigator>
    //   <BottomTab.Screen
    //     name="Popular"
    //     component={Popular}
    //     options={{
    //       tabBarLabel: '最热',
    //       tabBarIcon: ({ focused, color, size }) => (
    //         <MaterialIcons 
    //           name="whatshot"
    //           size={26}
    //           color={color}
    //         />
    //       )
    //     }}
    //   />
    //   <BottomTab.Screen
    //     name="Trending"
    //     component={Trending}
    //     options={{
    //       tabBarLabel: '趋势',
    //       tabBarIcon: ({ focused, color, size }) => (
    //         <Ionicons
    //           name="md-trending-up"
    //           size={26}
    //           color={color}
    //         />
    //       )
    //     }}
    //   />
    //   <BottomTab.Screen
    //     name="Favorite"
    //     component={Favorite}
    //     options={{
    //       tabBarLabel: '收藏',
    //       tabBarIcon: ({ focused, color, size }) => (
    //         <MaterialIcons 
    //           name="favorite"
    //           size={26}
    //           color={color}
    //         />
    //       )
    //     }}
    //   />
    //   <BottomTab.Screen
    //     name="Mine"
    //     component={Mine}
    //     options={{
    //       tabBarLabel: '我的',
    //       tabBarIcon: ({ focused, color, size }) => (
    //         <Entypo 
    //           name="user"
    //           size={26}
    //           color={color}
    //         />
    //       )
    //     }}
    //   />
    // </BottomTab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff'
  },
  home: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});

export default Home