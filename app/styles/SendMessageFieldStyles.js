import {StyleSheet, Dimensions} from 'react-native'
import {THEMES} from '../constants'
const {width} = Dimensions.get('window')
const padding = 16
const button = 35
const buttonMargin = 8

const {colors} = THEMES.gitterDefault

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: 60,
    paddingLeft: padding,
    backgroundColor: colors.androidGray,
    // alignSelf: 'stretch',
    elevation: 8
  },
  textInput: {
    width: width - padding * 2 - button - buttonMargin,
    backgroundColor: colors.androidGray
    // height: 60,
    // paddingDown: 2
  },
  button: {
    width: button,
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
