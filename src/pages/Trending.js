import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action'
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar'
import TrendingItem from '../common/TrendingItem';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORE } from '../expand/dao/DataStore';
import { favoriteHandle } from '../util'
import EventBus from 'react-native-event-bus';
import eventTypes from '../eventTypes'

const URL = 'https://github.com/trending/'
const QUERY_STR = '?since=daily'
const THEME_COLOR = '#678'
const PAGE_SIZE = 10

const tabNames = ['All', 'C++', 'C#', 'PHP', 'JavaScript', 'TypeScript']

const TopTab = createMaterialTopTabNavigator()
const favoriteDao = new FavoriteDao(FLAG_STORE.flag_trending)

const TitleViewComp = (props) => {
  const { timeSpan, onPress } = props

  return (
    <TouchableOpacity
      underlayColor="transparent"
      onPress={() => {
        onPress()
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: '#fff',
            fontWeight: '400'
          }}
        >
          趋势 {timeSpan.showText}
        </Text>
        <MaterialIcons 
          name="arrow-drop-down"
          size={22}
          style={{color: 'white'}}
        />
      </View>
    </TouchableOpacity>
  )
}

const Trending = () => {
  const [ visible, setVisible ] = useState(false)
  const [ timeSpan, setTimeSpan ] = useState(TimeSpans[0])

  const genTrendingTab = useCallback((props) => {
    return (
      <TrendingTab {...props} timeSpan={timeSpan} />
    )
  }, [timeSpan])

  return (
    <View
      style={{
        flex: 1,
        marginTop: DeviceInfo.getSystemName() !== 'Android' ? 30 : 0
      }}
    >
      <NavigationBar 
        // title="趋势"
        titleView={
          <TitleViewComp 
            timeSpan={timeSpan}
            onPress={() => {
              setVisible(true)
            }}
          />
        }
        style={{
          backgroundColor: THEME_COLOR
        }}
        statusBar={{
          backgroundColor: THEME_COLOR,
          barStyle: 'light-content',
        }}
      />
      <TopTab.Navigator
        tabBarOptions={{
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#678'
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }}
      >
        {
          tabNames.map((tab, index) => (
            <TopTab.Screen
              key={tab}
              name={tab}
              timeSpan={timeSpan}
              // component={ p => <TrendingTab {...p} timeSpan={timeSpan}/>}
              component={genTrendingTab}
              options={{
                title: tab
              }}
            />
          ))
        }
      </TopTab.Navigator>
      <TrendingDialog 
        visible={visible}
        onShow={() => {
          setVisible(true)
        }}
        onDismiss={() => {
          setVisible(false)
        }}
        onSelect={(t) => {
          setVisible(false)
          setTimeSpan(t)
        }}
      />
    </View>
  )
}

const TrendingContent = (props) => {
  // console.log('TTT', props)
  const toastRef = useRef(null)
  let canLoadMore = false
  let isFavoriteChanged = false

  const [a, setA] = useState(false)

  const { trending, route } = props
  let store = trending[route.name]
  if (!store) {
    store = {
      pageIndex: 1,
      items: [],
      isLoading: false,
      projectModes: [],
      hideLoadingMore: true
    }
  }

  const ListFooter = () => {
    return store.hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
    )
  }

  const loadData = (loadMore, refreshFavorite) => {
    const { route, onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite, timeSpan } = props
    const storeName = route.name
    const url = URL + (storeName === 'All' ? '' : storeName) + '?' + timeSpan.searchText
    console.log(url)
    if (loadMore) {
      console.log('loadMore')
      console.log('store', store)
      onLoadMoreTrending(storeName, ++store.pageIndex, PAGE_SIZE, store.items, favoriteDao, () => {
        toastRef.current.show('没有更多了')
      })
    } else if(refreshFavorite) {
      console.log('items', store.items)
      onFlushTrendingFavorite(storeName, store.pageIndex, PAGE_SIZE, store.items, favoriteDao)
    } else {
      console.log('refresh')
      onRefreshTrending(storeName, url, PAGE_SIZE, favoriteDao)
    }
  }

  const favoriteChangeHandle = () => {
    console.log('favorite change!!!')
    console.log('收藏后props', props)
    console.log('store', store)
    isFavoriteChanged = true
  }

  const bottomTabChangeHandle = (data) => {
    console.log('tab changed!!!', data)
    console.log('跳转后props', props)
    console.log('store', store)
    console.log(isFavoriteChanged)
    if (data.index === 1 && isFavoriteChanged) {
      console.log(33333)
      setA(s => !s)
      // loadData(null, true)
    }
  }

  useEffect(() => {
    loadData()
    EventBus.getInstance().addListener(eventTypes.FAVORITE_CHANGED_TRENDING, favoriteChangeHandle)
    EventBus.getInstance().addListener(eventTypes.BOTTOM_TAB_SELECT, bottomTabChangeHandle)

    return () => {
      EventBus.getInstance().removeListener(eventTypes.FAVORITE_CHANGED_TRENDING, favoriteChangeHandle)
      EventBus.getInstance().removeListener(eventTypes.BOTTOM_TAB_SELECT, bottomTabChangeHandle)
    }
  }, [])

  useEffect(() => {
    console.log('a变了', a)
    loadData(null, true)
  }, [a])

  return (
    <View style={styles.container}>
      <FlatList
        data={store.projectModes}
        renderItem={
          p => 
          <TrendingItem 
            projectModel={p.item} 
            onSelect={(callback) => {
              props.navigation.navigate('Detail', {
                projectModel: p.item,
                flag: FLAG_STORE.flag_trending,
                callback
              })
            }}
            onFavorite={(item, isFavorite) => {
              p.item.isFavorite = isFavorite
              favoriteHandle(favoriteDao, item, isFavorite, FLAG_STORE.flag_trending)
            }}
          />
        }
        keyExtractor={item => '' + (item.item.id || item.item.fullName)}
        refreshControl={
          <RefreshControl
            title="Loading"
            titleColor={THEME_COLOR}
            tintColor={THEME_COLOR}
            colors={[THEME_COLOR]}
            refreshing={store.isLoading}
            onRefresh={() => {
              console.log('下拉刷新')
              loadData()
            }}
          />
        }
        ListFooterComponent={ListFooter}
        onEndReached={() => {
          console.log('onEndReached---------')
          setTimeout(() => {
            if (canLoadMore) {
              loadData(true)
              canLoadMore = false
            }
          }, 100)
        }}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          canLoadMore = true
        }}
      />
      <Toast
        ref={toastRef}
        position="center"
      />
    </View>
  )
}

const mapStateToProps = state => ({
  trending: state.trending
})

const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => {
    dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao))
  },
  onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callback) => {
    dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback))
  },
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => {
    dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
  }
})

const TrendingTab = connect(mapStateToProps, mapDispatchToProps)(TrendingContent)

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
    minWidth: 50,
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
  }
});

export default Trending