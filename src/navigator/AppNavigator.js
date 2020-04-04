import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createSwitchNavigator } from '@react-navigation/compat'
import { NavigationContainer } from '@react-navigation/native'
import { connect } from 'react-redux'
// import { createReduxContainer, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import Welcome from '../pages/Welcome'
import Home from '../pages/Home'
import Detail from '../pages/Detail'

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
    </MainStack.Navigator>
  )
}

export const AppNavigator = (props) => {
  return (
    <NavigationContainer>
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
