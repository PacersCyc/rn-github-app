const defaultState = {
  welcome: true
}

export default function(state = defaultState, action) {
  switch(action.type) {
    case 'WELCOME_FINISH':
      return {
        ...state,
        welcome: !state.welcome
      }
    default:
      return state
  }
}