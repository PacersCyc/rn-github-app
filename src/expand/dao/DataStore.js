import { AsyncStorage } from 'react-native'

export default class DataStore {
  // 检测4小时内缓存有效
  static checkTimeStampValid(timeStamp) {
    const currentDate = new Date()
    const targetDate = new Date()
    targetDate.setTime(timeStamp)
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    return true;
  }

  _wrapData(data) {
    return {
      data,
      timeStamp: Date.now()
    }
  }

  saveData(url, data, callback) {
    if (!data || !url) {
      return
    }
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
  }

  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (err, result) => {
        if (!err) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
            console.error(e)
          }
        } else {
          reject(err)
          console.error(err)
        }
      })
    })
  }

  fetchNetData(url) {
    return new Promise((resolve, reject) => {
      fetch(url).then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('Network response is not OK')
      }).then(resData => {
        this.saveData(url, resData)
        resolve(resData)
      }).catch(error => {
        reject(error)
      })
    })
  }

  fetchData(url) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then(wrapData => {
          if (wrapData && DataStore.checkTimeStampValid(wrapData.timeStamp)) {
            resolve(wrapData)
          } else {
            this.fetchNetData(url).then(data => {
              resolve(this._wrapData(data))
            }).catch(e => {
              reject(e)
            })
          }
        })
        .catch(error => {
          this.fetchData(url).then(data => {
            resolve(this._wrapData(data))
          }).catch(err => {
            reject(err)
          })
        })
    })
  }
}