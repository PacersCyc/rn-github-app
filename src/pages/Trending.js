import React from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'

const Trending = (props) => {
  const { navigation } = props
  return (
    <View style={styles.container}>
      <Text style={styles.home}>Trending</Text>
      <Button 
        title="改变主题色"
        onPress={() => {
          navigation.setParams({
            theme: {
              tintColor: 'red',
              updateTime: Date.now()
            }
          })
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

export default Trending