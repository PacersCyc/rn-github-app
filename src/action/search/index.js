import types from '../types'
import DataStore, { FLAG_STORE } from '../../expand/dao/DataStore';
import { handleData, _projectModels } from '../ActionUtil'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const CANCEL_TOKENS = []

function getFetchUrl(key) {
  return API_URL + key + QUERY_STR
}

function hasCancel(token, isRemove) {
  let index = CANCEL_TOKENS.indexOf(token)
  if(index > -1) {
    isRemove && CANCEL_TOKENS.splice(index, 1)
    return true
  }
  return false
}

function checkKeyIsExist(keys, key) {
  return keys.map(k => k.name.toLowerCase()).indexOf(key.toLowerCase()) > -1
}

export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callback) {
  return dispatch => {
    dispatch({
      type: types.SEARCH_REFRESH
    })
    fetch(getFetchUrl(inputKey))
      .then(res => {
        return hasCancel(token) ? null : res.json()
      })
      .then(res => {
        if (hasCancel(token, true)) {
          console.log('user cancel')
          return
        }
        if (!res || !res.items || !res.items.length) {
          dispatch({
            type: types.SEARCH_FAIL,
            message: `没找到关于${inputKey}的项目`
          })
          typeof callback === 'function' && callback(`没找到关于${inputKey}的项目`)
          return
        }
        handleData(types.SEARCH_SUCCESS, dispatch, null, { data: res.items }, pageSize, favoriteDao, {
          showBottomButton: !checkKeyIsExist(popularKeys, inputKey),
          inputKey
        })
      })
      .catch(e => {
        console.log(e)
        dispatch({
          type: types.SEARCH_FAIL,
          error: e
        })
      })
  }
}

export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token)
    dispatch({
      type: types.SEARCH_CANCEL
    })
  }
}

export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more')
        }
        dispatch({
          type: types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex
        })
      } else {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex

        _projectModels(dataArray.slice(0, max), favoriteDao).then(projectModels => {
          console.log('projectModels===', projectModels)
          dispatch({
            type: types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModes: projectModels
          })
        })
      }
    }, 500)
  }
}

export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
  return dispatch => {
    let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex

    _projectModels(dataArray.slice(0, max), favoriteDao).then(projectModels => {
      dispatch({
        type: types.POPULAR_FAVORITE_FLUSH,
        storeName,
        pageIndex,
        projectModes: projectModels
      })
    }).catch(err => {
      console.log('onFlushPopularFavorite---', err)
    })
  }
}