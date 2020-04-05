import { FLAG_STORE } from './expand/dao/DataStore';

export function checkFavorite(item, keys = []) {
  if (!keys) return false
  for(let i=0, len = keys.length; i<len; i++) {
    let id = item.id ? item.id : item.fullName
    if (id.toString() === keys[i]) {
      return true
    }
  }
  return false
}

export function favoriteHandle(favoriteDao, item, isFavorite, flag) {
  console.log('item----', item)
  const key = (flag === FLAG_STORE.flag_trending) ? item.fullName : item.id + ''
  console.log(key)
  if (isFavorite) {
    favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
  } else {
    favoriteDao.removeFavoriteItem(key)
  }
}