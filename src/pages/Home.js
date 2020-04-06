import React, { useEffect } from 'react'
import { Text, View, StyleSheet, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/core'
// import { CommonActions } from '@react-navigation/routers'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import actions from '../action'
import Popular from './Popular';
import Trending from './Trending';
import Favorite from './Favorite';
import Mine from './Mine';
import CustomTheme from '../common/CustomTheme'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

const BottomTab = createBottomTabNavigator()

const Home = (props) => {
  const { customThemeViewVisible, onShowCustomThemeView } = props

  const onBackPress = () => {
    const { navigation, route } = props
    const { history, index, routes } = route.state
    alert('back---' + JSON.stringify(route.state))
    // alert(JSON.stringify(history) + '  ' + index)
    // if (!history || !history.length) {
    //   return false
    // }
    navigation.goBack()
    // props.navigation.dispatch(
    //   CommonActions.goBack()
    // )
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }
  }, [])

  return (
    <View style={{flex: 1}}>
      <DynamicTabNavigator />
      <CustomTheme 
        visible={customThemeViewVisible}
        {...props}
        onClose={() => {
          onShowCustomThemeView(false)
        }}
      />
    </View>
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

const mapStateToProps = state => ({
  customThemeViewVisible: state.theme.customThemeViewVisible
})
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => {
    dispatch(actions.onShowCustomThemeView(show))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)