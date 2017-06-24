import {StyleSheet} from 'react-native'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 16
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  icon: {
    marginRight: 8
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: colors.secondaryButton,
    elevation: 2,
    height: 35,
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatPrivately: {
    backgroundColor: colors.primaryButton
  },
  textWrapper: {
    // flex: 1
  },
  text: {
    fontSize: 18
  }
})

export default styles
