import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action'
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORE } from '../expand/dao/DataStore';
import { favoriteHandle } from '../util'
import TrendingItem from '../common/TrendingItem';
import eventTypes from '../eventTypes'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const PAGE_SIZE = 10

const tabNames = ['最热', '趋势']

const TopTab = createMaterialTopTabNavigator()

const Favorite = (props) => {
  const { theme } = props

  const genTabWrapper = (flag) => {
    return p => {
      return <FavoriteTab {...p} flag={flag} theme={theme} />
    }
  }

  return (
    <View
      style={styles.container}
      // style={{
      //   flex: 1,
      //   marginTop: DeviceInfo.getSystemName() !== 'Android' ? 30 : 0
      // }}
    >
      <NavigationBar
        title="收藏"
        style={theme.styles.navBar}
        statusBar={{
          backgroundColor: theme.themeColor,
          barStyle: 'light-content',
        }}
      />
      <TopTab.Navigator
        tabBarOptions={{
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          style: {
            backgroundColor: theme.themeColor
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }}
      >
        <TopTab.Screen
          key="popular"
          name="popular"
          component={genTabWrapper(FLAG_STORE.flag_popular)}
          options={{
            title: '最热'
          }}
        />
        <TopTab.Screen
          key="trending"
          name="trending"
          component={genTabWrapper(FLAG_STORE.flag_trending)}
          options={{
            title: '趋势'
          }}
        />
      </TopTab.Navigator>
    </View>
  )
}

const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme
})


const FavoriteContent = (props) => {
  console.log('FavoriteContent', props)
  const toastRef = useRef(null)
  let canLoadMore = false

  const { theme, favorite, route, flag } = props
  let favoriteDao = new FavoriteDao(flag)
  let store = favorite[route.name]
  if (!store) {
    store = {
      // pageIndex: 1,
      items: [],
      isLoading: false,
      projectModes: [],
      // hideLoadingMore: true
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

  const loadData = (isShowLoading) => {
    const { route, onLoadFavoriteData } = props
    onLoadFavoriteData(flag, isShowLoading)    
  }

  const changeFavoritesInfo = (data) => {
    console.log('favoriteRefresh', data)
    if (data.index === 2) {
      loadData(false)
    }
  }

  useEffect(() => {
    loadData(true)
    EventBus.getInstance().addListener(eventTypes.BOTTOM_TAB_SELECT, changeFavoritesInfo)

    return () => {
      EventBus.getInstance().removeListener(eventTypes.BOTTOM_TAB_SELECT, changeFavoritesInfo)
    }
  }, [])

  const ShowItem = flag === FLAG_STORE.flag_popular ? PopularItem :TrendingItem

  return (
    <View style={styles.container}>
      <FlatList
        data={store.projectModes}
        renderItem={p =>
          <ShowItem 
            // item={p.item}
            theme={theme}
            projectModel={p.item} 
            onSelect={(callback) => {
              console.log('跳转', p.item)
              NavigationUtil.goPage({
                navigation: props.navigation,
                projectModel: p.item,
                flag,
                theme,
                callback
              }, 'Detail')
            }}
            onFavorite={(item, isFavorite) => {
              console.log(p.item)
              p.item.isFavorite = isFavorite
              favoriteHandle(favoriteDao, item, isFavorite, flag)
              if (flag === FLAG_STORE.flag_popular) {
                EventBus.getInstance().fireEvent(eventTypes.FAVORITE_CHANGED_POPULAR)
              } else {
                EventBus.getInstance().fireEvent(eventTypes.FAVORITE_CHANGED_TRENDING)
              }
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
              loadData(true)
            }}
          />
        }
        // ListFooterComponent={ListFooter}
        // onEndReached={() => {
        //   console.log('onEndReached---------')
        //   setTimeout(() => {
        //     if (canLoadMore) {
        //       loadData(true)
        //       canLoadMore = false
        //     }
        //   }, 100)
        // }}
        // onEndReachedThreshold={0.5}
        // onMomentumScrollBegin={() => {
        //   canLoadMore = true
        // }}
      />
      <Toast
        ref={toastRef}
        position="center"
      />
    </View>
  )
}

const mapStateToProps = state => ({
  favorite: state.favorite
})

const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (flag, isShowLoading) => {
    dispatch(actions.onLoadFavoriteData(flag, isShowLoading))
  }
})

const FavoriteTab = connect(mapStateToProps, mapDispatchToProps)(FavoriteContent)

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

export default connect(mapFavoriteStateToProps)(Favorite)