import types from '../../action/types'

const defaultState = {}

export default function (state = defaultState, action) {
  switch (action.type) {
    case types.TRENDING_REFRESH_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,
          projectModes: action.projectModes,
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex
        }
      }
    case types.TRENDING_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true
        }
      }
    case types.TRENDING_REFRESH_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false
        }
      }
    case types.TRENDING_LOAD_MORE_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModes: action.projectModes,
          hideLoadingMore: false,
          pageIndex: action.pageIndex
        }
      }
    case types.TRENDING_LOAD_MORE_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex
        }
      }
    default:
      return state
  }
}