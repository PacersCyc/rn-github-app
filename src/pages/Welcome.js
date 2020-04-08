import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import NavigationUtil from '../navigator/NavigationUtil';

const Welcome = (props) => {
  // alert(JSON.stringify(props))
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setTimeout(() => {
      const { navigation, goToMain } = props
      SplashScreen.hide()
      goToMain()
      // navigation.navigate('Main')
      // NavigationUtil.resetToHomePage({
      //   navigation: props.navigation
      // })
    }, 2000)
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [])

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.welcome}>Welcome</Text>
  //   </View>
  // )
  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff'
  },
  welcome: {
    fontSize:20,
    textAlign:'center',
    margin:10
  }
});

const mapStateToProps = state => ({
  welcome: state.welcome.welcome
})

const mapDispatchToProps = dispatch => ({
  goToMain: () => {
    dispatch({
      type: 'WELCOME_FINISH'
    })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)