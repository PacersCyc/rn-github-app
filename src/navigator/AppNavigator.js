import React, { useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createSwitchNavigator } from '@react-navigation/compat'
import { NavigationContainer, useBackButton } from '@react-navigation/native'
import { connect } from 'react-redux'
import EventBus from 'react-native-event-bus'
// import { createReduxContainer, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import Welcome from '../pages/Welcome'
import Home from '../pages/Home'
import Detail from '../pages/Detail'
import About from '../pages/about/About'
import AboutMe from '../pages/about/AboutMe'
import CustomKey from '../pages/CustomKey'
import SortKey from '../pages/SortKey'
import Search from '../pages/Search'
import WebviewPage from '../pages/WebviewPage'
import eventTypes from '../eventTypes'

const InitStack = createStackNavigator()
const MainStack = createStackNavigator()
const Stack = createStackNavigator()

const InitScreen = () => {
  return (
    <InitStack.Navigator
      initialRouteName="Welcome"
    >
      <InitStack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false
        }}
      />
    </InitStack.Navigator>
  )
}

const MainScreen = () => {
  return (
    <MainStack.Navigator
      initialRouteName="Home"
    >
      <MainStack.Screen
        name="Home"
        component={Home}
        options={(route, navigation) => {
          // alert(JSON.stringify(route))
          return {
            headerShown: false
          }
        }}
      />
      <MainStack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen 
        name="About"
        component={About}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen 
        name="AboutMe"
        component={AboutMe}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen 
        name="CustomKey"
        component={CustomKey}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen 
        name="SortKey"
        component={SortKey}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen 
        name="Search"
        component={Search}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen 
        name="WebviewPage"
        component={WebviewPage}
        options={{
          headerShown: false
        }}
      />
    </MainStack.Navigator>
  )
}

export const AppNavigator = (props) => {
  const navContainerRef = useRef(null)

  useBackButton(navContainerRef.current)

  return (
    <NavigationContainer
      ref={navContainerRef}
      onStateChange={(state) => {
        console.log('stateChange', state)
        let tabIndex = state.routes[0].state.index
        EventBus.getInstance().fireEvent(eventTypes.BOTTOM_TAB_SELECT, {
          index: tabIndex
        })
      }}
    >
      {
        props.welcome ? <InitScreen /> : <MainScreen />
      }
      {/* <Stack.Navigator
        initialRouteName="Init"
      >
        <Stack.Screen
          name="Init"
          component={InitScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator> */}
    </NavigationContainer>
  )
}

const mapStateToProps = (state) => ({
  welcome: state.welcome.welcome
});
const AppWithNavigationState = connect(mapStateToProps)(AppNavigator)

export default AppWithNavigationState
