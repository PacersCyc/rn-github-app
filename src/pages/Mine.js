import React from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NavigationBar from '../common/NavigationBar'

const THEME_COLOR = '#678'

const RightButton = () => {
  return (
    <View style={{
      flexDirection: 'row'
    }}>
      <TouchableOpacity
        onPress={() => { }}
      >
        <View
          style={{
            padding: 5,
            marginRight: 8
          }}
        >
          <Feather
            name="search"
            size={24}
            style={{
              color: 'white'
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const LeftButton = props => {
  const { callback } = props
  return (
    <TouchableOpacity
      style={{
        padding: 8,
        paddingLeft: 12
      }}
      onPress={callback}
    >
      <Ionicons 
        name="ios-arrow-back"
        size={26}
        style={{
          color: 'white'
        }}
      />
    </TouchableOpacity>
  )
}

const Mine = () => {
  return (
    <View style={styles.container}>
      <NavigationBar
        title="我的"
        statusBar={{
          backgroundColor: THEME_COLOR,
          barStyle: 'light-content'
        }}
        style={{
          backgroundColor: THEME_COLOR
        }}
        rightButton={<RightButton />}
        leftButton={<LeftButton callback={() => {}}/>}
      />
      <Text style={styles.home}>Mine</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  home: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});

export default connect()(Mine)