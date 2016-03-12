import {StyleSheet} from 'react-native'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  mention: {
    fontWeight: 'bold'
  },
  url: {
    color: colors.link
  }
})

export default styles
