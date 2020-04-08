import React, { useState, useMemo, useEffect } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CheckBox from 'react-native-check-box'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import NavigationBar from '../common/NavigationBar'
import LeftBackButton from '../common/LeftBackButton'
import actions from '../action'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import LanguageDao from '../expand/dao/LanguageDao'
import { transferToDoubleArr } from '../util'

const THEME_COLOR = '#678'

const RightButton = props => {
  const { title, onPress } = props

  return (
    <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 16,
          color: '#fff',
          marginRight: 10
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const CustomKey = props => {
  console.log('CustomKey', props)
  const { navigation, route, language, onLoadLanguage } = props
  const { params } = route
  const { isRemoveKey, flag, theme } = params

  const [keys, setKeys] = useState([])
  const [changedKeys, setChangedKeys] = useState([])

  const title = useMemo(() => {
    return flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : (
      isRemoveKey ? '标签移除' : '自定义标签'
    )
  }, [flag, isRemoveKey])

  const realKeys = useMemo(() => {
    let key = (flag === FLAG_LANGUAGE.flag_key) ? 'keys' : 'languages'
    if (isRemoveKey) {
      return language[key].map(item => ({...item, checked: false}))
    } else {
      return language[key]
    }
  }, [flag, isRemoveKey, language])
  console.log('realKeys', realKeys)
  console.log('keys state ==== ', keys)

  const displayKeys = useMemo(() => transferToDoubleArr(keys), [keys])
  console.log('displayKeys', displayKeys)

  const languageDao = new LanguageDao(flag)

  const onBack = () => {
    if(changedKeys.length) {
      Alert.alert('提示', '要保存修改吗', [
        {
          text: '否',
          onPress: () => {
            navigation.goBack()
          }
        },
        {
          text: '是',
          onPress: () => {
            onSave()
          }
        }
      ])
    } else {
      navigation.goBack()
    }  
  }

  const onSave = () => {
    if(!changedKeys.length) {
      navigation.goBack()
      return
    }
    if(isRemoveKey) {
      // 过滤修改的标签
      console.log('remove keys', keys)
      console.log('changed keys', changedKeys)
      setKeys(items => items.filter((k, i) => !changedKeys.some(item => item.name === k.name)))
      let savedKeys = language.keys.filter((k, i) => !changedKeys.some(item => item.name === k.name))
      console.log('saved keys', savedKeys)
      languageDao.save(savedKeys)
    } else {
      languageDao.save(keys)
    }
    
    onLoadLanguage(flag)
    navigation.goBack()
  }

  const onCheckBoxClick = (data, index) => {
    console.log(data, index)
    setChangedKeys(arr => {
      return arr.indexOf(data) === -1 ? arr.concat({...data, checked: !data.checked}) : arr.filter(item => item!==data)
    })
    setKeys(arr => arr.map(item => item === data ? {...data, checked: !data.checked} : item))
  }

  const genCheckBox = ({data, index}) => {
    return (
      <CheckBox 
        style={{
          flex: 1,
          padding: 10
        }}
        onClick={() => onCheckBoxClick(data, index)}
        isChecked={data.checked}
        leftText={data.name}
        checkedImage={
          <Ionicons 
            name="ios-checkbox"
            size={20}
            style={{
              color: theme.themeColor
            }}
          />
        }
        unCheckedImage={
          <Ionicons 
            name="md-square-outline"
            size={20}
            style={{
              color: theme.themeColor
            }}
          />
        }
      />
    )
  }

  useEffect(() => {
    realKeys.length === 0 && onLoadLanguage(flag)
    setKeys(realKeys)
  }, [realKeys])

  return (
    <SafeAreaViewPlus
      topColor={theme.themeColor}
    >
      <NavigationBar
        title={title}
        style={theme.styles.navBar}
        leftButton={
          <LeftBackButton 
            onBack={() => {onBack()}}
          />
        }
        rightButton={
          <RightButton 
            title={isRemoveKey ? '移除' : '保存'}
            onPress={() => onSave()}
          />
        }
      />
      <ScrollView>
        {
          displayKeys.map(items => (
            <View key={items[0].index}>
              <View style={styles.item}>
                {genCheckBox(items[0])}
                {items[1] ? genCheckBox(items[1]) : <View style={{flex: 1, padding: 10}}/>}
              </View>
              <View style={styles.line} />
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaViewPlus>
  )
}

const mapStateToProps = state => ({
  language: state.language
})

const mapDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => {
    dispatch(actions.onLoadLanguage(flag))
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flexDirection: 'row'
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomKey)