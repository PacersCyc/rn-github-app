import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Popular from '../pages/Popular';
import Trending from '../pages/Trending';
import Favorite from '../pages/Favorite';
import Mine from '../pages/Mine';

const Tabs = [
  {
    name: 'Popular',
    component: Popular,
    options: {
      tabBarLabel: '最热',
      tabBarIcon: ({ focused, color, size }) => (
        <MaterialIcons
          name="whatshot"
          size={26}
          color={color}
        />
      )
    }
  },
  {
    name: 'Trending',
    component: Trending,
    options: ({ route, navigation }) => {
      // alert(JSON.stringify(route))
      return {
        tabBarLabel: '趋势',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name="md-trending-up"
            size={26}
            color={color}
          />
        )
      }
    }
  },
  {
    name: 'Favorite',
    component: Favorite,
    options: {
      tabBarLabel: '收藏',
      tabBarIcon: ({ focused, color, size }) => (
        <MaterialIcons
          name="favorite"
          size={26}
          color={color}
        />
      )
    }
  },
  {
    name: 'Mine',
    component: Mine,
    options: {
      tabBarLabel: '我的',
      tabBarIcon: ({ focused, color, size }) => (
        <Entypo
          name="user"
          size={26}
          color={color}
        />
      )
    }
  }
]

const TabBarComponent = props => {
  console.log('Tabbar', props)
  return (
    <BottomTabBar
      {...props}
      activeTintColor={props.theme || props.activeTintColor}
    />
  )
}

const BottomTab = createBottomTabNavigator()

const DynamicTabNavigator = (props) => {
  // console.disableYellowBox()
  return (
    <BottomTab.Navigator
      // screenOptions={({route, navigation}) => {
      //   alert(JSON.stringify(route))
      //   return {}
      // }}
      // backBehavior="history"
      tabBar={(bottomProps) => (
        <TabBarComponent {...bottomProps} theme={props.theme} />
      )}
      // tabBarOptions={{
      //   activeTintColor: 'tomato'
      // }}
    >
      {
        Tabs.map(tab => (
          <BottomTab.Screen
            {...tab}
            key={tab.name}
          />
        ))
      }
    </BottomTab.Navigator>
  )
}

const mapStateToProps = (state) => ({
  theme: state.theme.theme
})

export default connect(mapStateToProps)(DynamicTabNavigator)