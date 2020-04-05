import types from '../../action/types'

const defaultState = {}

export default function (state = defaultState, action) {
  switch (action.type) {
    case types.FAVORITE_LOAD_DATA:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
        }
      }
    case types.FAVORITE_LOAD_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
          projectModes: action.projectModes
        }
      }
    case types.FAVORITE_LOAD_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false
        }
      }
    default:
      return state
  }
}