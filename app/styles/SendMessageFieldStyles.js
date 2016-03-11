import {StyleSheet, Dimensions} from 'react-native'
import {THEMES} from '../constants'
const padding = 12
const button = 35
const buttonMargin = 8

const {colors} = THEMES.gitterDefault

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding,
    backgroundColor: colors.androidGray,
    elevation: 8
  },
  innerContainer: {
    flex: 1
  },
  textInput: {
    backgroundColor: colors.androidGray
  },
  button: {
    height: button,
    margin: buttonMargin,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendIcon: {
    width: 30,
    height: 30
  }
})

export default style
