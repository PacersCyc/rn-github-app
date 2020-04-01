import React, { useEffect } from 'react'
import { Text, View, StyleSheet, BackHandler } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/core'
// import { CommonActions } from '@react-navigation/routers'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Popular from './Popular';
import Trending from './Trending';
import Favorite from './Favorite';
import Mine from './Mine';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

const BottomTab = createBottomTabNavigator()

const Home = (props) => {
  // alert(JSON.stringify(props))

  const onBackPress = () => {
    alert('back---' + JSON.stringify(props.navigation))
    props.navigation.dispatch(
      CommonActions.goBack()
    )
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }
  }, [])

  return (
    <DynamicTabNavigator />
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