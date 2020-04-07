import types from '../../action/types'

const defaultState = {
  showText: '搜索',
  items: [],
  isLoading: false,
  projectModels: [],
  hideLoadingMore: true,
  showBottomButton: false
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case types.SEARCH_REFRESH:
      return {
        ...state,
        isLoading: true,
        hideLoadingMore: true,
        showBottomButton: false,
        showText: '取消'
      }
    case types.SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hideLoadingMore: false,
        showBottomButton: action.showBottomButton,
        items: action.items,
        projectModes: action.projectModes,
        pageIndex: action.pageIndex,
        showText: '搜索',
        inputKey: action.inputKey
      }
    case types.SEARCH_FAIL:
      return {
        ...state,
        showText: '搜索',
        isLoading: false,
        // hideLoadingMore: true
      }
    case types.SEARCH_CANCEL:
      return {
        ...state,
        isLoading: false,
        showText: '搜索',
      }
    case types.SEARCH_LOAD_MORE_SUCCESS:
      return {
        ...state,
        projectModes: action.projectModes,
        hideLoadingMore: false,
        pageIndex: action.pageIndex
      }
    case types.SEARCH_LOAD_MORE_FAIL:
      return {
        ...state,
        hideLoadingMore: true,
        pageIndex: action.pageIndex
      }
    default:
      return state
  }
}