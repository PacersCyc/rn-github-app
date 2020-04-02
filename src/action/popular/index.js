import types from '../types'
import DataStore from '../../expand/dao/DataStore';

function handleData(dispatch, storeName, data, pageSize) {
  let fixItems = []
  if (data && data.data && data.data.items) {
    fixItems = data.data.items
  }

  dispatch({
    type: types.POPULAR_REFRESH_SUCCESS,
    items: fixItems,
    projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
    storeName,
    pageIndex: 1
  })
}

export function onRefreshPopular(storeName, url, pageSize) {
  return dispatch => {
    dispatch({
      type: types.POPULAR_REFRESH,
      storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url)
      .then(data => {
        console.log(data)
        handleData(dispatch, storeName, data, pageSize)
      })
      .catch(err => {
        console.log(err)
        dispatch({
          type: types.POPULAR_LOAD_MORE_FAIL,
          storeName,
          error: err
        })
      })
  }
}

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callback) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1)*pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more')
        }
        dispatch({
          type: types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
          projectModes: dataArray
        })
      } else {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        dispatch({
          type: types.POPULAR_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModes: dataArray.slice(0, max)
        })
      }
    }, 500)
  }
}