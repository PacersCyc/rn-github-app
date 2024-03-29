import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import { useBackButton } from '@react-navigation/native'
import { WebView } from 'react-native-webview'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import DeviceInfo from 'react-native-device-info'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import NavigationBar from '../common/NavigationBar';
import LeftBackButton from '../common/LeftBackButton'
import ShareButton from '../common/ShareButton'
import FavoriteDao from '../expand/dao/FavoriteDao';
import ShareUtil from '../nativeUtil/ShareUtil'
import shareData from '../res/data/share.json'

const URL = 'https://github.com/'
const THEME_COLOR = '#678'

const RightButtonComp = props => {
  console.log('RightButton', props)
  const { isFavorite, onPress, onShare } = props

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
          name={isFavorite ? "star" : "star-o"}
          size={20}
          style={{
            color: 'white',
            marginRight: 10
          }}
        />
      </TouchableOpacity>
      <ShareButton
        onPress={() => {
          onShare()
        }}
      />
    </View>
  )
}

const Detail = (props) => {
  console.log('Detail', props)

  const { navigation, route } = props
  const { projectModel, flag, callback, theme } = route.params
  const { full_name, html_url, fullName, id } = projectModel.item

  const favoriteDao = new FavoriteDao(flag)

  const [isFavorite, setIsFavorite] = useState(projectModel.isFavorite)
  const [canBack, setCanBack] = useState(false)
  const [url, setUrl] = useState(html_url || (URL + fullName))

  const titleLayoutStyle = useMemo(() => {
    return url.length > 20 ? {
      paddingRight: 30
    } : null
  }, [url])

  const webviewRef = useRef(null)
  const navigationRef = useRef(navigation)

  useBackButton(navigationRef)

  const onFavoriteChange = () => {
    setIsFavorite(!isFavorite)
    typeof callback === 'function' && callback(!isFavorite)
  }

  const onShare = () => {
    const shareApp = shareData.share_app
    ShareUtil.shareboard(shareApp.content, shareApp.imgurl, url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
      console.log('result: ' + code + message)
    })
  }

  const onBack = () => {
    if (canBack) {
      webviewRef.current.goBack()
    } else {
      navigation.goBack()
    }
  }

  const onNavigationStateChange = e => {
    console.log('webview页面路由变了', e)
    setCanBack(e.canGoBack)
    setUrl(e.url)
  }

  const onBackPress = () => {
    onBack()
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }
  }, [onBackPress])

  return (
    <SafeAreaViewPlus
      topColor={theme.themeColor}
    >
      <NavigationBar
        title={full_name || fullName}
        titleLayoutStyle={titleLayoutStyle}
        leftButton={<LeftBackButton onBack={onBack} />}
        rightButton={
          <RightButtonComp
            isFavorite={isFavorite}
            onPress={onFavoriteChange}
            onShare={onShare}
          />
        }
        style={theme.styles.navBar}
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

export default Detail