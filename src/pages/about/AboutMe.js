import React, { useState, useRef } from 'react'
import { View, Linking, Clipboard } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-easy-toast'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import SettingItem from '../../common/SettingItem'
import config from '../../res/data/github_app_config.json'
import { MENUS } from '../../menu'
import globalStyles from '../../res/styles/globalStyles'

const THEME_COLOR = '#678'

const AboutMe = props => {
  console.log('About', props)
  const { navigation, route } = props
  const { theme } = route.params

  const toastRef = useRef(null)

  const [data, setData] = useState(config)
  const [tutorialShow, setTutorialShow] = useState(true)
  const [blogShow, setBlogShow] = useState(false)
  const [QQShow, setQQShow] = useState(false)
  const [contactShow, setContactShow] = useState(false)

  const onClick = item => {
    if (!item) return
    if (item.url) {
      navigation.navigate('WebviewPage', {
        title: item.title,
        url: item.url,
        theme
      })
      return
    }
    if (item.account && item.account.indexOf('@') !== -1) {
      let url = 'mailto://' + item.account
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log('can\'t handle url: ' + url)
          } else {
            Linking.openURL(url)
          }
        })
        .catch(e => {
          console.error('An error occurred', e)
        })
    }
    if (item.account) {
      Clipboard.setString(item.account)
      toastRef.current.show(item.title + item.account + '已复制到剪切板')
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

  const getItem = (data, isExpanded, toggleCb) => {
    return (
      <SettingItem
        onPress={() => {
          toggleCb(s => !s)
        }}
        Icons={Ionicons}
        text={data.name}
        icon={data.icon}
        color={theme.themeColor}
        expandableIcon={isExpanded ? 'ios-arrow-up' : 'ios-arrow-down'}
      />
    )
  }

  const getSubItems = (items) => {
    console.log('items', items)
    let renderItems = Array.isArray(items) ? items : Object.keys(items).map(key => items[key])
    return renderItems.map((item, i) => (
      <View key={i}>
        <SettingItem
          onPress={() => {
            onClick(item)
          }}
          text={item.account ? `${item.title} : ${item.account}` : item.title}
          color={theme.themeColor}
        />
        <View style={globalStyles.line} />
      </View>
    ))
  }

  return (
    <View style={{flex: 1}}>
      <AboutCommon
        {...route.params}
        navigation={navigation}
        flagAbout={FLAG_ABOUT.flag_about_me}
        updateConfig={setData}
        params={data.author}
        contentView={
          <View>
            {getItem(data.aboutMe.Tutorial, tutorialShow, setTutorialShow)}
            {tutorialShow && getSubItems(data.aboutMe.Tutorial.items)}
            <View style={globalStyles.line} />
            {getItem(data.aboutMe.Blog, blogShow, setBlogShow)}
            {blogShow && getSubItems(data.aboutMe.Blog.items)}
            <View style={globalStyles.line} />
            {getItem(data.aboutMe.QQ, QQShow, setQQShow)}
            {QQShow && getSubItems(data.aboutMe.QQ.items)}
            <View style={globalStyles.line} />
            {getItem(data.aboutMe.Contact, contactShow, setContactShow)}
            {contactShow && getSubItems(data.aboutMe.Contact.items)}
          </View>
        }
      />
      <Toast 
        ref={toastRef}
        position='center'
      />
    </View>
  )
}

export default AboutMe