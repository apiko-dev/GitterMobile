import {StyleSheet} from 'react-native'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault
import ExtraDimensions from 'react-native-extra-dimensions-android'
const STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  toolbar: {
    backgroundColor: colors.raspberry,
    height: 56,
    elevation: 4
  },
  toolbarPadding: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: colors.raspberry
  }
})

export default styles
