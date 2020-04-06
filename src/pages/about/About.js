import React, { useState } from 'react'
import { View, Linking } from 'react-native'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import SettingItem from '../../common/SettingItem'
import config from '../../res/data/github_app_config.json'
import { MENUS } from '../../menu'
import globalStyles from '../../res/styles/globalStyles'

const THEME_COLOR = '#678'

const AboutPage = props => {
  console.log('About', props)
  const { navigation, route } = props
  const { theme } = route.params

  const [ data, setData ] = useState(config)

  const onClick = menu => {
    let routeName = ''
    let params = {
      theme
    }
    switch(menu) {
      case MENUS.Tutorial:
        routeName = 'WebviewPage'
        params.title = '百度'
        params.url = 'https://www.baidu.com/'
        break;
      case MENUS.About_Author:
        routeName = 'AboutMe'
        break;
      case MENUS.Feedback:
        const url = 'mailto://cyc_jk@163.com'
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log('can\'t handle url: ' + url)
            } else {
              Linking.openURL(url)
            }
          })
          .catch(e => {
            console.error('An error occurred', e)
          })
      default:
        break;
    }
    if (routeName) {
      navigation.navigate(routeName, params)
    }
  }

  const getSettingItem = (menu) => {
    return (
      <SettingItem 
        onPress={() => {
          onClick(menu)
        }}
        Icons={menu.Icons}
        icon={menu.icon}
        text={menu.name}
        color={theme.themeColor}
      />
    )
  }

  return (
    <AboutCommon
      {...route.params}
      navigation={navigation}
      flagAbout={FLAG_ABOUT.flag_about}
      updateConfig={setData}
      params={data.app}
      contentView={
        <View>
          {getSettingItem(MENUS.Tutorial)}
          <View style={globalStyles.line} />
          {getSettingItem(MENUS.About_Author)}
          <View style={globalStyles.line} />
          {getSettingItem(MENUS.Feedback)}
        </View>
      }
    />
  )
} 

export default AboutPage