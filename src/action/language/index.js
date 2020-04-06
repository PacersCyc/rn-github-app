import types from '../types'
import LanguageDao from '../../expand/dao/LanguageDao'

// export function onLoadLanguage(flagKey) {
//   return async dispatch => {
//     let languages
//     try {
//       languages = await new LanguageDao(flagKey).fetch()
//     } catch (error) {
//       console.log(error)
//     }
//     dispatch({
//       type: types.LANGUAGE_LOAD_SUCCESS,
//       languages,
//       flag: flagKey
//     })
//   }
// }

export function onLoadLanguage(flagKey) {
  return dispatch => {
    new LanguageDao(flagKey).fetch()
      .then(languages => {
        dispatch({
          type: types.LANGUAGE_LOAD_SUCCESS,
          languages,
          flag: flagKey
        })
      })
      .catch(e => {
        console.log(e)
      })
  }
}