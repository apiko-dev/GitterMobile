import {StyleSheet} from 'react-native'
import {THEMES} from '../constants'

const {colors} = THEMES.gitterDefault

const style = StyleSheet.create({
  container: {
    // height: 60,
    paddingLeft: 16,
    backgroundColor: colors.androidGray,
    alignSelf: 'stretch',
    elevation: 8
  },
  textInput: {
    // height: 60,
    // paddingDown: 2
  }
})

export default style
