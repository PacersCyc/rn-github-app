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

const URL = 'https://github.com/trending/'
const QUERY_STR = '?since=daily'
const THEME_COLOR = '#678'
const PAGE_SIZE = 10

const tabNames = ['All', 'C++', 'C#', 'PHP', 'JavaScript', 'TypeScript']

const TopTab = createMaterialTopTabNavigator()

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

  const loadData = (loadMore) => {
    const { route, onRefreshTrending, onLoadMoreTrending, timeSpan } = props
    const storeName = route.name
    const url = URL + (storeName === 'All' ? '' : storeName) + '?' + timeSpan.searchText
    console.log(url)
    if (loadMore) {
      console.log('loadMore')
      console.log('store', store)
      onLoadMoreTrending(storeName, ++store.pageIndex, PAGE_SIZE, store.items, () => {
        toastRef.current.show('没有更多了')
      })
    } else {
      console.log('refresh')
      onRefreshTrending(storeName, url, PAGE_SIZE)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={store.projectModes}
        renderItem={
          p => 
          <TrendingItem 
            item={p.item} 
            onSelect={() => {
              props.navigation.navigate('Detail', {
                projectModel: p.item
              })
            }} 
          />
        }
        keyExtractor={item => '' + (item.id || item.fullName)}
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
  onRefreshTrending: (storeName, url, pageSize) => {
    dispatch(actions.onRefreshTrending(storeName, url, pageSize))
  },
  onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, callback) => {
    dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, callback))
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