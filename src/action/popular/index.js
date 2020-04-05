import types from '../types'
import DataStore, { FLAG_STORE } from '../../expand/dao/DataStore';
import { handleData, _projectModels } from '../ActionUtil'

export function onRefreshPopular(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({
      type: types.POPULAR_REFRESH,
      storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url, FLAG_STORE.flag_popular)
      .then(data => {
        console.log(data)
        handleData(types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
      })
      .catch(err => {
        console.log(err)
        dispatch({
          type: types.POPULAR_REFRESH_FAIl,
          storeName,
          error: err
        })
      })
  }
}

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more')
        }
        dispatch({
          type: types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
          // projectModes: dataArray
        })
      } else {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex

        _projectModels(dataArray.slice(0, max), favoriteDao).then(projectModels => {
          console.log('projectModels===', projectModels)
          dispatch({
            type: types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModes: projectModels
          })
        })
        // dispatch({
        //   type: types.POPULAR_LOAD_MORE_SUCCESS,
        //   storeName,
        //   pageIndex,
        //   projectModes: dataArray.slice(0, max)
        // })
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