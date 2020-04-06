import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import { WebView } from 'react-native-webview'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import DeviceInfo from 'react-native-device-info'
import NavigationBar from '../common/NavigationBar';
import LeftBackButton from '../common/LeftBackButton'
import ShareButton from '../common/ShareButton'
import FavoriteDao from '../expand/dao/FavoriteDao';

const URL = 'https://github.com/'
const THEME_COLOR = '#678'

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

const Detail = (props) => {
  console.log('Detail', props)

  const { navigation, route } = props
  const { projectModel, flag, callback } = route.params
  const { full_name, html_url, fullName, id } = projectModel.item

  const favoriteDao = new FavoriteDao(flag)

  const [ isFavorite, setIsFavorite ] = useState(projectModel.isFavorite)
  const [ canBack, setCanBack ] = useState(false)
  const [ url, setUrl ] = useState(html_url || (URL + fullName))

  const titleLayoutStyle = useMemo(() => {
    return url.length > 20 ? {
      paddingRight: 30
    } : null
  }, [url])

  const webviewRef = useRef(null)

  const onFavoriteChange = () => {
    setIsFavorite(!isFavorite)
    typeof callback === 'function' && callback(!isFavorite)
    // let key = fullName || id.toString()
    // console.log('key', key)
    // console.log(favoriteDao)
    // if (!projectModel.isFavorite) {
    //   favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
    // } else {
    //   favoriteDao.removeFavoriteItem(key)
    // }
  }

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
    <View style={styles.container}>
      <NavigationBar 
        title={full_name || fullName}
        titleLayoutStyle={titleLayoutStyle}
        leftButton={<LeftBackButton onBack={onBack} />}
        rightButton={
          <RightButtonComp 
            isFavorite={isFavorite}
            onPress={onFavoriteChange}
          />
        }
        style={{
          backgroundColor: THEME_COLOR
        }}
      />
      <WebView 
        source={{
          uri: url
        }}
        ref={webviewRef}
        startInLoadingState={true}
        onNavigationStateChange={onNavigationStateChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.getSystemName() !== 'Android' ? 30 : 0
  },
});

export default Detail