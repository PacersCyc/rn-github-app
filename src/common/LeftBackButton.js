import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const LeftBackButton = props => {
  const { color = 'white', onBack } = props

  return (
    <TouchableOpacity
      style={{
        padding: 8,
        paddingLeft: 12
      }}
      onPress={onBack}
    >
      <Ionicons 
        name="ios-arrow-back"
        size={26}
        style={{color}}
      />
    </TouchableOpacity>
  )
}

export default LeftBackButton