import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import appReducer from '../reducer'

// 自定义redux中间件
const logger = store => next => action => {
  if (typeof action === 'function') {
    console.log('dispatching a function')
  } else {
    console.log('dispatching', action)
  }
  const result = next(action)
  console.log('nextState', store.getState())
}

const middlewares = [
  logger,
  thunk,
]

export default createStore(
  appReducer,
  applyMiddleware(...middlewares)
)