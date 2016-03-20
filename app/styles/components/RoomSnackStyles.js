import {StyleSheet, Dimensions} from 'react-native'
import {THEMES} from '../../constants'

const {colors} = THEMES.gitterDefault
const {width} = Dimensions.get('window')


const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 56,
    right: 0,
    height: 25,
    width,
    elevation: 4
  },
  text: {
    textAlign: 'center'
  },
  info: {
    backgroundColor: colors.androidGray
  },
  progressBar: {
    position: 'absolute',
    top: -6,
    right: 0,
    left: 0,
    elevation: 4
  }
})

export default style
