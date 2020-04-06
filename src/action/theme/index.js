import types from '../types'
import ThemeDao from '../../expand/dao/ThemeDao';

export function onThemeInit() {
  return dispatch => {
    new ThemeDao().getTheme()
      .then(data => {
        dispatch(onThemeChange(data))
      })
  }
}

export function onThemeChange(theme) {
  return {
    type: types.THEME_CHANGE,
    theme
  }
}

export function onShowCustomThemeView(show) {
  return {
    type: types.SHOW_THEME_VIEW,
    customThemeViewVisible: show
  }
}