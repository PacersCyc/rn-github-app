import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action'
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORE } from '../expand/dao/DataStore';
import { favoriteHandle } from '../util'
import EventBus from 'react-native-event-bus';
import eventTypes from '../eventTypes'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const PAGE_SIZE = 10

const tabNames = ['JavaScript', 'TypeScript', 'React', 'React Native', 'Nodejs', 'Go']

const TopTab = createMaterialTopTabNavigator()
const favoriteDao = new FavoriteDao(FLAG_STORE.flag_popular)

// const genPopularTab = p => <PopularTab {...p} />

const Popular = (props) => {
  console.log('Popular', props)
  return (
    <View
      style={{
        flex: 1,
        marginTop: DeviceInfo.getSystemName() !== 'Android' ? 30 : 0
      }}
    >
      <NavigationBar
        title="最热"
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
              component={PopularTab}
              // component={genPopularTab}
              options={{
                title: tab
              }}
            />
          ))
        }
      </TopTab.Navigator>
    </View>
  )
}

const PopularContent = (props) => {
  const toastRef = useRef(null)
  let canLoadMore = false
  let isFavoriteChanged = false

  const [ a, setA ] = useState(false)
  // console.log('PopularTab', props)

  const { popular, route } = props
  console.log('popular-----', popular)

  const getStore = () => {
    const { popular, route } = props
    let store = popular[route.name]
    if (!store) {
      store = {
        pageIndex: 1,
        items: [],
        isLoading: false,
        projectModes: [],
        hideLoadingMore: true
      }
    }
    return store
  }
  let store = popular[route.name]
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
    console.log('props', props)
    const { route, onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = props
    const storeName = route.name
    // console.log('storeName', storeName)
    const url = URL + storeName + QUERY_STR
    let store = getStore()
    console.log('store', store)
    console.log(url)
    if (loadMore) {
      console.log('loadMore')
      // console.log('store', store)
      onLoadMorePopular(storeName, ++store.pageIndex, PAGE_SIZE, store.items, favoriteDao, () => {
        toastRef.current.show('没有更多了')
      })
    } else if (refreshFavorite) {
      console.log('items', store.items)
      onFlushPopularFavorite(storeName, store.pageIndex, PAGE_SIZE, store.items, favoriteDao)    
    } else {
      console.log('refresh')
      onRefreshPopular(storeName, url, PAGE_SIZE, favoriteDao)
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
    if (data.index === 0 && isFavoriteChanged) {
      console.log(33333)
      setA(s => !s)
      // loadData(null, true)
    }
  }

  useEffect(() => {
    loadData()
    EventBus.getInstance().addListener(eventTypes.FAVORITE_CHANGED_POPULAR, favoriteChangeHandle)
    EventBus.getInstance().addListener(eventTypes.BOTTOM_TAB_SELECT, bottomTabChangeHandle)

    return () => {
      console.log('PopularTab, unmount!')
      EventBus.getInstance().removeListener(eventTypes.FAVORITE_CHANGED_POPULAR, favoriteChangeHandle)
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
        data={getStore().projectModes}
        renderItem={p =>
          <PopularItem
            // item={p.item}
            projectModel={p.item}
            onSelect={(callback) => {
              console.log('跳转', p.item)
              NavigationUtil.goPage({
                navigation: props.navigation,
                projectModel: p.item,
                flag: FLAG_STORE.flag_popular,
                callback
              }, 'Detail')
            }}
            onFavorite={(item, isFavorite) => {
              console.log(p.item)
              p.item.isFavorite = isFavorite
              favoriteHandle(favoriteDao, item, isFavorite, FLAG_STORE.flag_popular)
            }}
          />
        }
        keyExtractor={item => '' + item.item.id}
        refreshControl={
          <RefreshControl
            title="Loading"
            titleColor={THEME_COLOR}
            tintColor={THEME_COLOR}
            colors={[THEME_COLOR]}
            refreshing={store.isLoading}
            onRefresh={() => {
              console.log('下拉刷新')
              console.log('props====', props)
              loadData()
            }}
          />
        }
        ListFooterComponent={ListFooter}
        onEndReached={() => {
          console.log('onEndReached---------')
          console.log('props======', props)
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
  popular: state.popular
})

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => {
    dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao))
  },
  onLoadMorePopular: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callback) => {
    dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback))
  },
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => {
    dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
  }
})

const PopularTab = connect(mapStateToProps, mapDispatchToProps)(PopularContent)

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
  }
});

export default Popular