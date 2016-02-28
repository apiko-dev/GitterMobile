import {StyleSheet, Dimensions} from 'react-native'
import ExtraDimensions from 'react-native-extra-dimensions-android'
import {THEMES} from '../constants'

const {colors} = THEMES.gitterDefault
const {width} = Dimensions.get('window')
const STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT')


const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 56 + STATUS_BAR_HEIGHT,
    right: 0,
    height: 25,
    width,
    elevation: 2
  },
  text: {
    textAlign: 'center',
    color: 'white'
  },
  info: {
    backgroundColor: colors.darkRed
  }
})

export default style
