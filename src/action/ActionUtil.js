import ProjectModel from '../model/ProjectModel';
import { checkFavorite } from '../util';

export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao, params) {
  let fixItems = []
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items
    }
  }
  let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize)

  _projectModels(showItems, favoriteDao).then(projectModels => {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModes: projectModels,
      storeName,
      pageIndex: 1,
      ...params
    })
  }).catch(e => {
    console.log(e)
  })

  // _projectModels(showItems, favoriteDao, projectModels => {
  //   dispatch({
  //     type: actionType,
  //     items: fixItems,
  //     projectModes: projectModels,
  //     storeName,
  //     pageIndex: 1
  //   })
  // })
}

export function _projectModels(showItems, favoriteDao) {
  return new Promise((resolve, reject) => {
    favoriteDao.getFavoriteKeys()
      .then(keys => {
        console.log('keys', keys)
        let projectModels = []
        for (let i = 0, len = showItems.length; i < len; i++) {
          projectModels.push(new ProjectModel(showItems[i], checkFavorite(showItems[i], keys)))
        }
        console.log('projectModels---', projectModels)
        resolve(projectModels)
      })
      .catch(e => {
        console.log(e)
        reject(e)
      })
  })
}

// export async function _projectModels(showItems, favoriteDao, callback) {
//   let keys = []
//   try {
//     keys = await favoriteDao.getFavoriteKeys()
//   } catch (error) {
//     console.log(error)
//   }
//   let projectModels = []
//   for (let i = 0, len = showItems.length; i < len; i++) {
//     projectModels.push(new ProjectModel(showItems[i], checkFavorite(showItems[i], keys)))
//   }
//   if (typeof callback === 'function') {
//     callback(projectModels)
//   }
// }