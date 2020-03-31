import React, { useEffect, useRef } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import NavigationUtil from '../navigator/NavigationUtil';

const Welcome = (props) => {
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setTimeout(() => {
      const { navigation } = props
      // navigation.navigate('Main')
      NavigationUtil.resetToHomePage({
        navigation: props.navigation
      })
    }, 2000)
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome</Text>
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
  welcome: {
    fontSize:20,
    textAlign:'center',
    margin:10
  }
});

export default Welcome