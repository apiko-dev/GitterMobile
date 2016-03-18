import {StyleSheet} from 'react-native'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  item: {
    height: 50,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: colors.androidGray,
    borderBottomColor: colors.androidGray
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
  center: {
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  text: {
    fontSize: 18
  }
})

export default styles
