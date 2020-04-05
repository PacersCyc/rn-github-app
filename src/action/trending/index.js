import types from '../types'
import DataStore, { FLAG_STORE } from '../../expand/dao/DataStore';
import { handleData, _projectModels } from '../ActionUtil'

export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({
      type: types.TRENDING_REFRESH,
      storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url, FLAG_STORE.flag_trending)
      .then(data => {
        console.log(data)
        handleData(types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
      })
      .catch(err => {
        console.log(err)
        dispatch({
          type: types.TRENDING_REFRESH_FAIL,
          storeName,
          error: err
        })
      })
  }
}

export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1)*pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more')
        }
        dispatch({
          type: types.TRENDING_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
          projectModes: dataArray
        })
      } else {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        
        _projectModels(dataArray.slice(0, max), favoriteDao).then(data => {
          dispatch({
            type: types.TRENDING_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModes: data
          })
        })
        // dispatch({
        //   type: types.TRENDING_LOAD_MORE_SUCCESS,
        //   storeName,
        //   pageIndex,
        //   projectModes: dataArray.slice(0, max)
        // })
      }
    }, 500)
  }
}