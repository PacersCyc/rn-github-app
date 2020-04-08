import React from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import actions from '../action'
import NavigationBar from '../common/NavigationBar'
import SettingItem from '../common/SettingItem'
import { MENUS } from '../menu'
import globalStyles from '../res/styles/globalStyles'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

const RightButton = () => {
  return (
    <View style={{
      flexDirection: 'row'
    }}>
      <TouchableOpacity
        onPress={() => { }}
      >
        <View
          style={{
            padding: 5,
            marginRight: 8
          }}
        >
          <Feather
            name="search"
            size={24}
            style={{
              color: 'white'
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const LeftButton = props => {
  const { callback } = props
  return (
    <TouchableOpacity
      style={{
        padding: 8,
        paddingLeft: 12
      }}
      onPress={callback}
    >
      <Ionicons
        name="ios-arrow-back"
        size={26}
        style={{
          color: 'white'
        }}
      />
    </TouchableOpacity>
  )
}

const Mine = (props) => {
  const { navigation, theme, onShowCustomThemeView } = props

  const onClick = menu => {
    console.log('menu', menu.name)
    let routeName = ''
    let params = {
      theme
    }
    switch (menu) {
      case MENUS.Tutorial:
        routeName = 'WebviewPage'
        params.title = '百度'
        params.url = 'https://www.baidu.com/'
        break;
      case MENUS.About:
        routeName = 'About'
        break;
      case MENUS.About_Author:
        routeName = 'AboutMe'
        break;
      case MENUS.Custom_Key:
      case MENUS.Remove_Key:
      case MENUS.Custom_Language:
        routeName = 'CustomKey'
        params.isRemoveKey = menu === MENUS.Remove_Key;
        params.flag = (menu !== MENUS.Custom_Language) ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
        break;
      case MENUS.Sort_Key:
        routeName = 'SortKey'
        params.flag = FLAG_LANGUAGE.flag_key
        break;
      case MENUS.Sort_Language:
        routeName = 'SortKey'
        params.flag = FLAG_LANGUAGE.flag_language
        break;
      case MENUS.Custom_Theme:
        onShowCustomThemeView(true)
        break;
      default:
        break;
    }
    if (routeName) {
      navigation.navigate(routeName, params)
    }
  }

  const genSettingItem = menu => {
    return (
      <SettingItem
        Icons={menu.Icons}
        icon={menu.icon}
        text={menu.name}
        color={theme.themeColor}
        onPress={() => { onClick(menu) }}
      />
    )
  }

  return (
    <View style={globalStyles.root_container}>
      <NavigationBar
        title="我的"
        statusBar={{
          backgroundColor: theme.themeColor,
          barStyle: 'light-content'
        }}
        style={theme.styles.navBar}
        // rightButton={<RightButton />}
        // leftButton={<LeftButton callback={() => { }} />}
      />
      <ScrollView>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClick(MENUS.About)
          }}
        >
          <View style={styles.about_left}>
            <MENUS.About.Icons
              name={MENUS.About.icon}
              size={40}
              style={{
                marginRight: 10,
                color: theme.themeColor
              }}
            />
            <Text>Github Popular</Text>
          </View>
          <Ionicons
            name="ios-arrow-forward"
            size={16}
            style={{
              marginRight: 10,
              alignSelf: 'center',
              color: theme.themeColor
            }}
          />
        </TouchableOpacity>
        <View style={globalStyles.line} />
        {genSettingItem(MENUS.Tutorial)}

        <Text style={styles.groupTitle}>趋势管理</Text>
        {genSettingItem(MENUS.Custom_Language)}
        <View style={globalStyles.line} />
        {genSettingItem(MENUS.Sort_Language)}

        <Text style={styles.groupTitle}>最热管理</Text>
        {genSettingItem(MENUS.Custom_Key)}
        <View style={globalStyles.line} />
        {genSettingItem(MENUS.Sort_Key)}
        <View style={globalStyles.line} />
        {genSettingItem(MENUS.Remove_Key)}

        <Text style={styles.groupTitle}>设置</Text>
        {genSettingItem(MENUS.Custom_Theme)}
        <View style={globalStyles.line} />
        {genSettingItem(MENUS.About_Author)}
        <View style={globalStyles.line} />
        {genSettingItem(MENUS.Feedback)}

      </ScrollView>
    </View>
  )
}

const mapStateToProps = state => ({
  theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => {
    dispatch(actions.onShowCustomThemeView(show))
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90,
    padding: 10,
    backgroundColor: 'white'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Mine)