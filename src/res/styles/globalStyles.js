import { Dimensions } from 'react-native';

const BACKGROUND_COLOR = '#f3f3f4'
const { width, height } = Dimensions.get('window')

export default {
  root_container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  line: {
    height: 0.5,
    opacity: 0.5,
    backgroundColor: 'darkgray'
  },
  backgroundColor: BACKGROUND_COLOR,
  nav_bar_height_ios: 44,
  nav_bar_height_android: 50,
  window_height: height
}