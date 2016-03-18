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
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: colors.androidGray,
    borderBottomColor: colors.androidGray
  },
  icon: {
    height: 28,
    width: 28
  }
})

export default styles
