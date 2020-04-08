import React, { useState, useMemo, useEffect } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Alert, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SortableListView from 'react-native-sortable-listview'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import NavigationBar from '../common/NavigationBar'
import LeftBackButton from '../common/LeftBackButton'
import actions from '../action'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import LanguageDao from '../expand/dao/LanguageDao'
import { transferToDoubleArr, isArraysEqual } from '../util'

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

const SortKey = props => {
  console.log('SortKey', props)
  const { navigation, route, language, onLoadLanguage } = props
  const { params } = route
  const { flag, theme } = params

  const [checkedArray, setCheckedArray] = useState([])
  console.log('checkedArray', checkedArray)

  const title = useMemo(() => flag === FLAG_LANGUAGE.flag_language ? '语言排序': '标签排序', [flag]) 
  const sortFlag = useMemo(() => (flag === FLAG_LANGUAGE.flag_key) ? 'keys' : 'languages', [flag])

  const realKeys = useMemo(() => {
    // return checkedArray.length ? checkedArray : language[sortFlag].filter(item => item.checked)
    return language[sortFlag].filter(item => item.checked)
  }, [sortFlag, language])

  const languageDao = new LanguageDao(flag)

  const getSortResult = () => {
    let result = [...language[sortFlag]]
    for(let i=0;i<realKeys.length;i++) {
      let item = realKeys[i]
      let index = language[sortFlag].indexOf(item)
      result.splice(index, 1, checkedArray[i])
    }
    return result
  }

  const onBack = () => {
    console.log('realKeys', realKeys)
    console.log('checkedArray', checkedArray)
    if(!isArraysEqual(realKeys, checkedArray)) {
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
            onSave(true)
          }
        }
      ])
    } else {
      navigation.goBack()
    }  
  }

  const onSave = (hasChecked) => {
    if(!hasChecked) {
      if(isArraysEqual(realKeys, checkedArray)) {
        navigation.goBack()
        return
      }
    }
    languageDao.save(getSortResult())
    onLoadLanguage(flag)
    navigation.goBack()
  }

  useEffect(() => {
    realKeys.length === 0 && onLoadLanguage(flag)
    setCheckedArray(realKeys)
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
            title='保存'
            onPress={() => onSave()}
          />
        }
      />
      {/* 拖拽排序未生效，待实现 */}
      <SortableListView 
        data={checkedArray}
        order={Object.keys(checkedArray)}
        onRowMoved={e => {
          console.log(e)
          // let items = [...checkedArray]
          // items.splice(e.to, 0, items.splice(e.from, 1)[0])
          // setCheckedArray(items)
          setCheckedArray(items => {
            let newItems = [...items]
            let tmp = newItems[e.from]
            newItems[e.from] = newItems[e.to]
            newItems[e.to] = tmp
            return newItems
          })
        }}
        renderRow={(row) => <SortCell data={row} {...params} />}
      />
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

const SortCell = props => {
  const { theme, data, sortHandles } = props

  return (
    <TouchableHighlight
      underlayColor="#eee"
      style={data.checked ? styles.item : styles.hidden}
      {...sortHandles}
    >
      <View
        style={{
          marginLeft: 10,
          flexDirection: 'row'
        }}
      >
        <MaterialCommunityIcons 
          name="sort"
          size={16}
          style={{
            marginRight: 10,
            color: theme.themeColor
          }}        
        />
        <Text>{data.name}</Text>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  hidden: {
    height: 0
  },
  item: {
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SortKey)