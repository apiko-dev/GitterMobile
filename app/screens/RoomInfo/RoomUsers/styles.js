import {StyleSheet} from 'react-native'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    // flex: 1
  },
  usersContainer: {
    // flex: 1,
    padding: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  itemContainer: {
    margin: 2
  },
  buttonsGroup: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16
  },
  button: {
    width: 128,
    height: 32,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue
  },
  primaryButton: {
    backgroundColor: colors.primaryButton
  }
})

export default styles
