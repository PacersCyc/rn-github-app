import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ShareButton = props => {
  return (
    <TouchableOpacity
      underlayColor="transparent"
      onPress={props.onPress}
    >
      <Ionicons 
        name="md-share"
        size={20}
        style={{
          opacity: 0.9,
          marginRight: 10,
          color: 'white'
        }}
      />
    </TouchableOpacity>
  )
}

export default ShareButton