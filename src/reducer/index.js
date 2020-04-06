import { combineReducers } from 'redux'
// import { createNavigationReducer } from 'react-navigation-redux-helpers'
import { AppNavigator } from '../navigator/AppNavigator'
import theme from './theme'
import welcome from './welcome'
import popular from './popular'
import trending from './trending'
import favorite from './favorite'
import language from './language'

// const navReducer = createNavigationReducer(AppNavigator)

const appReducer = combineReducers({
  theme,
  welcome,
  popular,
  trending,
  favorite,
  language
})

export default appReducer