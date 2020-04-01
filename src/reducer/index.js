import { combineReducers } from 'redux'
// import { createNavigationReducer } from 'react-navigation-redux-helpers'
import { AppNavigator } from '../navigator/AppNavigator'
import theme from './theme'
import welcome from './welcome'

// const navReducer = createNavigationReducer(AppNavigator)

const appReducer = combineReducers({
  theme,
  welcome
})

export default appReducer