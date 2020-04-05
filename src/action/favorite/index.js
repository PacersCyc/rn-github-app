import types from '../types'
import DataStore, { FLAG_STORE } from '../../expand/dao/DataStore';
import { handleData, _projectModels } from '../ActionUtil'
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';

export function onLoadFavoriteData(flag, isShowLoading) {
  return dispatch => {
    if (isShowLoading) {
      dispatch({
        type: types.FAVORITE_LOAD_DATA,
        storeName: flag
      })
    }
    let dataStore = new DataStore()
    new FavoriteDao(flag).getAllItems()
      .then(items => {
        let resultData = []
        for(let i=0,len=items.length;i<len;i++) {
          resultData.push(new ProjectModel(items[i], true))
        }
        dispatch({
          type: types.FAVORITE_LOAD_SUCCESS,
          projectModes: resultData,
          storeName: flag
        })
      })
      .catch(e => {
        console.log(e)
        dispatch({
          type: types.FAVORITE_LOAD_FAIL,
          error: e,
          storeName: flag
        })
      })
  }
}
