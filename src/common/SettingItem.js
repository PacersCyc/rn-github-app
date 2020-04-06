import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const SettingItem = props => {
  const {
    onPress,
    Icons,
    icon,
    color,
    text,
    expandableIcon
  } = props

  return (
    <TouchableOpacity
      onPress={() => {
        onPress()
      }}
      style={styles.setting_item_container}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {
          (Icons && icon) ? (
            <Icons
              name={icon}
              size={16}
              style={{
                color,
                marginRight: 10
              }}
            />
          ) : (
              <View
                style={{
                  opacity: 1,
                  width: 16,
                  height: 16,
                  marginRight: 10
                }}
              />
            )
        }
        <Text>{text}</Text>
      </View>
      <Ionicons
        name={expandableIcon || "ios-arrow-forward"}
        size={16}
        style={{
          marginRight: 10,
          alignSelf: 'center',
          color: color || 'black'
        }}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: 'white',
    padding: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default SettingItem