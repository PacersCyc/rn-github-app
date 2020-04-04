import React from 'react'
import PropTypes from 'prop-types'
import { ViewPropTypes, View, StyleSheet, Text, StatusBar, Platform } from 'react-native'

const NAV_BAR_HEIGHT_IOS = 44
const NAV_BAR_HEIGHT_ANDROD = 50
const STATUS_BAR_HEIGHT = 20

const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string
}

const NavigationBar = (props) => {
  const {
    style,
    statusBar,
    title,
    titleView,
    titleLayoutStyle,
    hide,
    leftButton,
    rightButton
  } = props

  return (
    <View style={[styles.container, style]}>
      {
        !statusBar.hidden && (
          <View style={styles.statusBar}>
            <StatusBar {...statusBar} />
          </View>
        )
      }
      {
        !hide && (
          <View style={styles.navBar}>
            <View style={styles.navBarButton}>
              {leftButton}
            </View>
            <View style={[
              styles.navBarTitleContainer,
              titleLayoutStyle
            ]}>
              {
                titleView ? titleView : (
                  <Text
                    ellipsizeMode="head"
                    numberOfLines={1}
                    style={styles.title}
                  >
                    {title}
                  </Text>
                )
              }
            </View>
            <View style={styles.navBarButton}>
              {rightButton}
            </View>
          </View>
        )
      }
    </View>
  )
}

NavigationBar.defaultProps = {
  statusBar: {
    barStyle: 'light-content',
    hidden: false
  }
}

NavigationBar.propTypes = {
  style: ViewPropTypes.style,
  title: PropTypes.string,
  titleView: PropTypes.element,
  titleLayoutStyle: ViewPropTypes.style,
  hide: PropTypes.bool,
  statusBar: PropTypes.shape(StatusBarShape),
  rightButton: PropTypes.element,
  leftButton: PropTypes.element
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196f3'
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0
  },
  title: {
    fontSize: 20,
    color: 'white'
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROD
  },
  navBarButton: {
    alignItems: 'center'
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0
  }
})

export default NavigationBar