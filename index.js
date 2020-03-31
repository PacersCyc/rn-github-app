/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
// import AppNavigator from './src/navigator/AppNavigator'
import App from './App';
import Welcome from './src/pages/Welcome'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
