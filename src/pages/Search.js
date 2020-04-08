import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action'
import LeftBackButton from '../common/LeftBackButton'
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORE } from '../expand/dao/DataStore';
import { favoriteHandle, isIphoneX } from '../util'
import EventBus from 'react-native-event-bus';
import eventTypes from '../eventTypes'
import FavoriteButton from '../common/FavoriteButton'
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import globalStyles from '../res/styles/globalStyles'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
// const THEME_COLOR = '#678'
const PAGE_SIZE = 10

const tabNames = ['JavaScript', 'TypeScript', 'React', 'React Native', 'Nodejs', 'Go']

const TopTab = createMaterialTopTabNavigator()
const favoriteDao = new FavoriteDao(FLAG_STORE.flag_popular)
const languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)

const Search = (props) => {
  console.log('Search', props)
  const toastRef = useRef(null)
  const inputRef = useRef(null)
  const searchToken = useRef(null)

  const [inputKey, setInputKey] = useState('')

  const { navigation, route, search, keys, onLoadMoreSearch, onSearch, onSearchCancel, onLoadLanguage } = props
  const { showText, isLoading, projectModes, showBottomButton, hideLoadingMore } = search
  const { params } = route
  const { theme } = params
  let canLoadMore = false
  let isKeyChange = false

  const onBack = () => {
    onSearchCancel()

    navigation.goBack()
    if (isKeyChange) {
      onLoadLanguage(FLAG_LANGUAGE.flag_key)
    }
  }

  const onRightButtonClick = () => {
    if (showText === '搜索') {
      loadData()
    } else {
      onSearchCancel(searchToken)
    }
  }

  const onSaveKey = () => {
    let index = keys.map(k => k.name.toLowerCase()).indexOf(inputKey.toLowerCase())
    if(index > -1) {
      toastRef.current.show(`${inputKey}已经存在`)
    } else {
      let data = {
        path: inputKey,
        name: inputKey,
        checked: true
      }
      languageDao.save([data].concat(keys))
      toastRef.current.show(`${inputKey}保存成功`)
      isKeyChange = true
    }
  }

  const loadData = (loadMore) => {
    if (loadMore) {
      console.log('加载更多====')
      onLoadMoreSearch(++search.pageIndex, PAGE_SIZE, search.items, favoriteDao, () => {
        toastRef.current.show('没有更多了')
      })
    } else {
      console.log('====keys====', keys)
      searchToken.current = Date.now()
      onSearch(inputKey, PAGE_SIZE, searchToken, favoriteDao, keys, message => {
        toastRef.current.show(message)
      })
    }
  }

  return (
    <View
      style={{
        flex: 1,
        marginTop: isIphoneX() ? 30 : 0
      }}
      // style={globalStyles.root_container}
    >
      {
        Platform.OS === 'ios' && !isIphoneX() && (
          <View style={[styles.statusBar, { backgroundColor: theme.themeColor }]} />
        )
      }
      {/* {
        Platform.OS === 'ios' && (
          <View style={[styles.statusBar, { backgroundColor: theme.themeColor }]} />
        )
      } */}

      <View
        style={{
          backgroundColor: theme.themeColor,
          flexDirection: 'row',
          alignItems: 'center',
          height: (Platform.OS === 'ios') ? globalStyles.nav_bar_height_ios : globalStyles.nav_bar_height_android
        }}
      >
        <LeftBackButton onBack={onBack} />
        <TextInput
          ref={inputRef}
          placeholder={inputKey || '请输入'}
          value={inputKey}
          onChangeText={text => {
            console.log(text)
            setInputKey(text.trim())
          }}
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={() => {
            inputRef.current.blur()
            onRightButtonClick()
          }}
        >
          <View style={{marginRight: 10}}>
            <Text style={styles.title}>{showText}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {
          isLoading && (
            <ActivityIndicator
              style={styles.centering}
              size="large"
              animating={isLoading}
            />
          )
        }
        {
          !isLoading && (
            <FlatList
              data={projectModes}
              keyExtractor={item => item.item.id + ''}
              renderItem={data => (
                <PopularItem
                  projectModel={data.item}
                  theme={theme}
                  onSelect={(callback) => {
                    navigation.navigate('Detail', {
                      theme,
                      projectModel: data.item,
                      flag: FLAG_STORE.flag_popular,
                      callback
                    })
                  }}
                  onFavorite={(item, isFavorite) => {
                    console.log(data.item)
                    data.item.isFavorite = isFavorite
                    favoriteHandle(favoriteDao, item, isFavorite, FLAG_STORE.flag_popular)
                  }}
                />
              )}
              contentInset={{
                bottom: 45
              }}
              refreshControl={
                <RefreshControl
                  title='loading'
                  titleColor={theme.themeColor}
                  tintColor={theme.themeColor}
                  colors={[theme.themeColor]}
                  refreshing={isLoading}
                  onRefresh={() => loadData()}
                />
              }
              ListFooterComponent={() => hideLoadingMore ? null : (
                <View style={styles.indicatorContainer}>
                  <ActivityIndicator
                    style={styles.indicator}
                  />
                  <Text>正在加载更多</Text>
                </View>
              )}
              onEndReached={() => {
                console.log('more!!!')
                setTimeout(() => {
                  console.log('给不给', canLoadMore)
                  if (canLoadMore) {
                    loadData(true)
                    canLoadMore = false
                  }
                }, 100)
              }}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() => {
                console.log('begin!!!')
                canLoadMore = true
              }}
            />
          )
        }
      </View>

      {
        showBottomButton && (
          <TouchableOpacity
            style={[styles.bottomButton, { backgroundColor: theme.themeColor }]}
            onPress={() => {
              onSaveKey()
            }}
          >
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.title}>朕收下了</Text>
            </View>
          </TouchableOpacity>
        )
      }

      <Toast
        ref={toastRef}
        position="center"
      />
    </View>
  )
}

const mapStateToProps = (state) => ({
  keys: state.language.keys,
  search: state.search
})
const mapDispatchToProps = dispatch => ({
  onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callback) => {
    dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callback))
  },
  onSearchCancel: (token) => {
    dispatch(actions.onSearchCancel(token))
  },
  onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callback) => {
    dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callback))
  },
  onLoadLanguage: (flag) => {
    dispatch(actions.onLoadLanguage(flag))
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  home: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  tabStyle: {
    // minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
    textTransform: 'capitalize',
    color: '#fff'
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  },
  statusBar: {
    height: 20
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: globalStyles.window_height - 45 - (isIphoneX() ? 34 : 0),
    right: 10,
    borderRadius: 3
  },
  centering: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: '500'
  },
  textInput: {
    flex: 1,
    height: (Platform.OS === 'ios') ? 26 : 36,
    borderWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderColor: "white",
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Search)