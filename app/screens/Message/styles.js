import {StyleSheet} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  toolbar: {
    height: 56,
    backgroundColor: colors.raspberry,
    elevation: 4,
    marginBottom: 8
  },
})

export default styles
