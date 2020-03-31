import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createSwitchNavigator } from '@react-navigation/compat'
import Welcome from '../pages/Welcome'
import Home from '../pages/Home'
import Detail from '../pages/Detail'

const InitNavigator = createStackNavigator({
  Welcome: {
    screen: Welcome,
    navigationOptions: {
      header: null
    }
  }
})

const MainNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {

    }
  },
  Detail: {
    screen: Detail,
    navigationOptions: {

    }
  }
})

const SwitchNavigator = createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
}, {
  navigationOptions: {
    header: null
  }
})

export default SwitchNavigator