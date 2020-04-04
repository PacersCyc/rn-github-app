import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import { WebView } from 'react-native-webview'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import DeviceInfo from 'react-native-device-info'
import NavigationBar from '../common/NavigationBar';

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
  return (
    <View
      style={{
        flexDirection: 'row'
      }}
      onPress={() => {}}
    >
      <TouchableOpacity>
        <FontAwesome 
          name="star-o"
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
  const { full_name, html_url, fullName } = route.params.projectModel

  const [ canBack, setCanBack ] = useState(false)
  const [ url, setUrl ] = useState(html_url || (URL + fullName))

  const titleLayoutStyle = useMemo(() => {
    return url.length > 20 ? {
      paddingRight: 30
    } : null
  }, [url])

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
    <View style={styles.container}>
      <NavigationBar 
        title={full_name || fullName}
        titleLayoutStyle={titleLayoutStyle}
        leftButton={<LeftBackButton onBack={onBack} />}
        rightButton={<RightButtonComp />}
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