import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

const Mine = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.home}>Mine</Text>
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

export default Mine