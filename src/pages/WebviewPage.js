import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import { WebView } from 'react-native-webview'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import DeviceInfo from 'react-native-device-info'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from '../expand/dao/FavoriteDao';

const URL = 'https://github.com/'
const THEME_COLOR = '#678'

const LeftBackButton = props => {
  const { onBack } = props

  return (
    <TouchableOpacity
      style={{
        padding: 8,
        paddingLeft: 12
      }}
      onPress={() => onBack()}
    >
      <Ionicons 
        name="ios-arrow-back"
        size={26}
        style={{color: 'white'}}
      />
    </TouchableOpacity>
  )
}

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

const RightButtonComp = props => {
  console.log('RightButton', props)
  const { isFavorite, onPress } = props

  return (
    <View
      style={{
        flexDirection: 'row'
      }}
    >
      <TouchableOpacity
        onPress={() => {
          onPress()
        }}
      >
        <FontAwesome 
          name={isFavorite ? "star" :"star-o"}
          size={20}
          style={{
            color: 'white',
            marginRight: 10
          }}
        />
      </TouchableOpacity>
      <ShareButton 
        onPress={() => {}}
      />
    </View>
  )
}

// 简单的浏览器封装
const WebviewPage = (props) => {
  const { navigation, route } = props
  const { params } = route

  const [ canBack, setCanBack ] = useState(false)
  const [ url, setUrl ] = useState(params.url)
  const [ title, setTitle ] = useState(params.title)

  const webviewRef = useRef(null)

  const onBack = useCallback(() => {
    if (canBack) {
      webviewRef.current.goBack()
    } else {
      navigation.goBack()
    }
  }, [canBack])

  const onNavigationStateChange = e => {
    setCanBack(e.canGoBack)
    setUrl(e.url)
  }

  const onBackPress = () => {
    // alert('back!!!')
    onBack()
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }
  }, [])

  return (
    <SafeAreaViewPlus
      topColor={params.theme.themeColor}
    >
      <NavigationBar 
        title={title}
        leftButton={<LeftBackButton onBack={() => onBackPress()} />}
        style={params.theme.styles.navBar}
      />
      <WebView 
        source={{
          uri: url
        }}
        ref={webviewRef}
        startInLoadingState={true}
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeAreaViewPlus>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.getSystemName() !== 'Android' ? 30 : 0
  },
});

export default WebviewPage