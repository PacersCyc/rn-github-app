import { Platform, Dimensions } from 'react-native'
import { FLAG_STORE } from './expand/dao/DataStore';

const X_WIDTH = 375;
const X_HEIGHT = 812;

export function checkFavorite(item, keys = []) {
  if (!keys) return false
  for (let i = 0, len = keys.length; i < len; i++) {
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

export function isIphoneX() {
  const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window')
  if (Platform.OS === 'web') return false

  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
  )
}