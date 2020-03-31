/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Welcome from './src/pages/Welcome';
import Home from './src/pages/Home';
import Detail from './src/pages/Detail';

const InitStack = createStackNavigator()
const MainStack = createStackNavigator()
const Stack = createStackNavigator()

const InitScreen = () => {
  return (
    <InitStack.Navigator
      initialRouteName="Welcome"
    >
      <InitStack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false
        }}
      />
    </InitStack.Navigator>
  )
}

const MainScreen = () => {
  return (
    <MainStack.Navigator
      initialRouteName="Home"
    >
      <MainStack.Screen
        name="Home"
        component={Home}
        options={(route, navigation) => {
          // alert(JSON.stringify(route))
          return {
            headerShown: false
          }
        }}
      />
      <MainStack.Screen
        name="Detail"
        component={Detail}
      />
    </MainStack.Navigator>
  )
}

const App: () => React$Node = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Init"
        >
          <Stack.Screen
            name="Init"
            component={InitScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{
              headerShown: false
            }}
          />
          {/* <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
          />
          <Stack.Screen
            name="Detail"
            component={Detail}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
