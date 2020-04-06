import { AsyncStorage } from 'react-native'
import ThemeFactory, { ThemeFlags } from '../../res/styles/ThemeFactory'

const THEME_KEY = 'theme_key'

export default class ThemeDao {
  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (err, result) => {
        if (err) {
          return reject(err)
        }
        if (!result) {
          this.save(ThemeFlags.Default)
          resolve(ThemeFlags.Default)
        }
        resolve(ThemeFactory.createTheme(result))
      })
    })
  }

  save(themeFlag) {
    AsyncStorage.setItem(THEME_KEY, themeFlag, (err) => {
      
    })
  }
}