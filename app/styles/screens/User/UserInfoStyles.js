import {StyleSheet} from 'react-native'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  icon: {
    height: 28,
    width: 28,
    marginRight: 8
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: colors.secondaryButton,
    elevation: 2
  },
  chatPrivately: {
    backgroundColor: colors.primaryButton
  },
  textWrapper: {
    flex: 1
  },
  text: {
    fontSize: 18
  }
})

export default styles
