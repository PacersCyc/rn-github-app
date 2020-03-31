import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import NavigationUtil from '../navigator/NavigationUtil';

const tabNames = ['JavaScript', 'TypeScript', 'React', 'React Native', 'Nodejs', 'Go']

const TopTab = createMaterialTopTabNavigator()

const Popular = () => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: 30
      }}
    >
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
              component={PopularContent}
              options={{
                title: tab
              }}
            />
          ))
        }
        {/* <TopTab.Screen
          name="Tab1"
          component={PopularContent}
        />
        <TopTab.Screen
          name="Tab2"
          component={PopularContent}
        /> */}
      </TopTab.Navigator>
    </View>
  )
}

const PopularContent = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.home}>{JSON.stringify(props)}</Text>
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
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff'
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
    textTransform: 'capitalize'
  }
});

export default Popular