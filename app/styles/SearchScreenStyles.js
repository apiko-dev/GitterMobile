import {StyleSheet} from 'react-native'
import {THEMES} from '../constants'

const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.androidGray
  },
  toolbar: {
    height: 56,
    backgroundColor: colors.raspberry,
    elevation: 4
  },
  toolbarContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textInput: {
    color: 'white',
    height: 24,
    fontSize: 18
  }
})

export default styles
