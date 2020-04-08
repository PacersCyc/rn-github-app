import React from 'react'
import { SafeAreaView, View, ViewPropTypes, StyleSheet } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import PropTypes from 'prop-types'
import { isIphoneX } from '../util'

const SafeAreaViewPlus = props => {
  const { enablePlus, children, style, topInset, bottomInset, topColor, bottomColor } = props

  return enablePlus ?  (
    <View style={[styles.container, style]}>
      {
        !isIphoneX() || !topInset ? null : (
          <View style={[styles.topArea, { backgroundColor: topColor }]} />
        )
      }
      {children}
      {
        !isIphoneX() || !bottomInset ? null : (
          <View style={[styles.bottomArea, { backgroundColor: bottomColor }]} />
        )
      }
    </View>
  ) : (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  )
}

SafeAreaViewPlus.propTypes = {
  topColor: PropTypes.string,
  bottomColor: PropTypes.string,
  enablePlus: PropTypes.bool,
  topInset: PropTypes.bool,
  bottomInset: PropTypes.bool
}

SafeAreaViewPlus.defaultProps = {
  topColor: 'transparent',
  bottomColor: '#f8f8f8',
  enablePlus: true,
  topInset: true,
  bottomInset: false
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topArea: {
    height: 44
  },
  bottomArea: {
    height: 34
  }
})

export default SafeAreaViewPlus