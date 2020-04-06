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

export function transferToDoubleArr(arr, n = 2) {
  return arr.reduce(
    (pre, cur, i) => {
      let newCur = {
        data: cur,
        index: i
      }
      return !pre.length
        ? [[newCur]]
        : (pre[pre.length - 1].length === n ? pre.concat([[newCur]]) : pre.map(item => item.length < n ? item.concat(newCur) : item))
    },
    []
  )
}

export function isArraysEqual(arr1, arr2) {
  if (!(arr1 && arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0, l = arr1.length; i < l; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}