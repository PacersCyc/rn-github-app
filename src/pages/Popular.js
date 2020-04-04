import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action'
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const PAGE_SIZE = 10

const tabNames = ['JavaScript', 'TypeScript', 'React', 'React Native', 'Nodejs', 'Go']

const TopTab = createMaterialTopTabNavigator()

const Popular = () => {
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

const ListItem = props => {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ backgroundColor: '#faa' }}>
        {JSON.stringify(props.item)}
      </Text>
    </View>
  )
}

const PopularContent = (props) => {
  const toastRef = useRef(null)
  let canLoadMore = false

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
    const { route, onRefreshPopular, onLoadMorePopular } = props
    const storeName = route.name
    const url = URL + storeName + QUERY_STR
    console.log(url)
    if (loadMore) {
      console.log('loadMore')
      console.log('store', store)
      onLoadMorePopular(storeName, ++store.pageIndex, PAGE_SIZE, store.items, () => {
        toastRef.current.show('没有更多了')
      })
    } else {
      console.log('refresh')
      onRefreshPopular(storeName, url, PAGE_SIZE)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={store.projectModes}
        //renderItem={ListItem}
        renderItem={p =>
          <PopularItem 
            item={p.item} 
            onSelect={() => {
              console.log('跳转', p.item)
              NavigationUtil.goPage({
                navigation: props.navigation,
                projectModel: p.item
              }, 'Detail')
            }} 
          />
        }
        keyExtractor={item => '' + item.id}
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
      {/* <Text style={styles.home}>{JSON.stringify(props)}</Text>
      <Text
        onPress={() => {
          NavigationUtil.goPage(
            {
              navigation: props.navigation
            }, 
            'Detail'
          )
        }}
      >
        跳转到详情页
      </Text> */}
    </View>
  )
}

const mapStateToProps = state => ({
  popular: state.popular
})

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize) => {
    dispatch(actions.onRefreshPopular(storeName, url, pageSize))
  },
  onLoadMorePopular: (storeName, pageIndex, pageSize, dataArray, callback) => {
    dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, dataArray, callback))
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