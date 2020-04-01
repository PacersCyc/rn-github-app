import React from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, Button } from 'react-native'
import { onThemeChange } from '../action/theme/index';

const Trending = (props) => {
  const { navigation } = props
  return (
    <View style={styles.container}>
      <Text style={styles.home}>Trending</Text>
      <Button 
        title="改变主题色"
        onPress={() => {
          props.onThemeChange('#096')
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
    fontSize:20,
    textAlign:'center',
    margin:10
  }
});

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => {
    dispatch(onThemeChange(theme))
  }
})

export default connect(null, mapDispatchToProps)(Trending)