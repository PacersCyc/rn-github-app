import React, { useState, useEffect, useMemo } from 'react'
import { Dimensions, Platform, View, Image, Text, StyleSheet } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import defaultConfig from '../../res/data/github_app_config'
import globalStyles from '../../res/styles/globalStyles'
import { isIphoneX } from '../../util'
import LeftBackButton from '../../common/LeftBackButton'
import ShareButton from '../../common/ShareButton'

const THEME_COLOR = '#678'
const window = Dimensions.get('window')
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = (Platform.OS === 'ios') ? 20 + (isIphoneX() ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? globalStyles.nav_bar_height_ios + TOP : globalStyles.nav_bar_height_android

export const FLAG_ABOUT = {
  flag_about: 'about',
  flag_about_me: 'about_me'
}

const AboutCommon = props => {
  const {
    theme,
    contentView,
    updateConfig,
    params
  } = props

  const avatar = typeof (params.avatar) === 'string' ? { uri: params.avatar } : params.avatar
  console.log('avatar', avatar)
  // const [ config, setConfig ] = useState(defaultConfig)

  useEffect(() => {
    fetch('https://www.devio.org/io/GitHubPopular/json/github_app_config.json')
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('Network Error')
      })
      .then(res => {
        // res && setConfig(res)
        res && updateConfig(res)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  return (
    <ParallaxScrollView
      backgroundColor={theme.themeColor}
      contentBackgroundColor={globalStyles.backgroundColor}
      parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
      stickyHeaderHeight={STICKY_HEADER_HEIGHT}
      backgroundScrollSpeed={10}
      renderBackground={() => (
        <View key="background">
          <Image
            source={{
              uri: params.backgroundImg,
              width: window.width,
              height: PARALLAX_HEADER_HEIGHT
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: window.width,
              backgroundColor: 'rgba(0,0,0,.4)',
              height: PARALLAX_HEADER_HEIGHT
            }}
          />
        </View>
      )}
      renderForeground={() => (
        <View key="parallax-header" style={styles.parallaxHeader}>
          <Image style={styles.avatar}
            source={avatar} />
          <Text style={styles.sectionSpeakerText}>
            {params.name}
          </Text>
          <Text style={styles.sectionTitleText}>
            {params.description}
          </Text>
        </View>
      )}
      renderStickyHeader={() => (
        <View key="sticky-header" style={styles.stickySection}>
          <Text style={styles.stickySectionText}>{params.name}</Text>
        </View>
      )}
      renderFixedHeader={() => (
        <View key="fixed-header" style={styles.fixedSection}>
          <LeftBackButton 
            // color={theme.themeColor}
            onBack={() => {
              props.navigation.goBack()
            }}
          />
          <ShareButton 
            // color={theme.themeColor}
            onPress={() => {}}
          />
        </View>
      )}
    >
      {contentView}
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: TOP
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10
  },
})

export default AboutCommon