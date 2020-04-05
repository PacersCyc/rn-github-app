import { AsyncStorage } from 'react-native'

const FAVORITE_KEY_PREFIX = 'favorite_'

export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = `${FAVORITE_KEY_PREFIX}${flag}`
  }

  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (err, result) => {
      if (!err) {
        this.updateFavoriteKeys(key, true)
      }
    })
  }

  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (err, result) => {
      if (!err) {
        let favoriteKeys = []
        if (result) {
          favoriteKeys = JSON.parse(result)
        }
        let index = favoriteKeys.indexOf(key)
        if (isAdd) {
          // console.log('save')
          if (index === -1) favoriteKeys.push(key)
        } else {
          // console.log('remove')
          if (index !== -1) favoriteKeys.splice(index, 1)
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys)).then(() => {
          // console.log(key, favoriteKeys)
        })
      }
    })
  }

  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (err, result) => {
        if(!err) {
          try {
            resolve(JSON.parse(result))
          } catch (error) {
            reject(err)
          }
        } else {
          reject(err)
        }
      })
    })
  }

  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (err, result) => {
      if (!err) {
        this.updateFavoriteKeys(key, false)
      }
    })
  }

  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then(keys => {
        let items = []
        if (keys) {
          AsyncStorage.multiGet(keys, (err, stores) => {
            try {
              stores.map((result, i, store) => {
                let key = store[i][0]
                let value = store[i][1]
                if (value) {
                  items.push(JSON.parse(value))
                }
              })
              resolve(items)
            } catch (error) {
              reject(error)
            }
          })
        } else {
          resolve(items)
        }
      })
    }).catch(e => {
      reject(e)
    })
  }
}