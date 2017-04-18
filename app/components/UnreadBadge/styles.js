import {StyleSheet} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mention: {
    backgroundColor: colors.mention
  },
  unread: {
    backgroundColor: colors.green
  },
  text: {
    color: colors.white,
    fontSize: 10
  },
  lurk: {
    width: 8,
    height: 8,
    borderRadius: 8,
    borderColor: colors.green,
    borderWidth: 1,
    backgroundColor: 'transparent'
  }
})

export default styles
