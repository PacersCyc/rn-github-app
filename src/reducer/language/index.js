import types from '../../action/types'
import { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao';

const defaultState = {
  languages: [],
  keys: []
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case types.LANGUAGE_LOAD_SUCCESS:
      if(action.flag === FLAG_LANGUAGE.flag_key) {
        return {
          ...state,
          keys: action.languages
        }
      } else {
        return {
          ...state,
          languages: action.languages
        }
      }
    default:
      return state
  }
}