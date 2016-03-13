import {StyleSheet} from 'react-native'
import {THEMES} from '../constants'

const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.androidGray
  },
  toolbar: {
    height: 56,
    backgroundColor: colors.raspberry,
    elevation: 4
  },
  toolbarContainer: {
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  textInput: {
    color: 'white',
    height: 24,
    fontSize: 18,
    alignSelf: 'stretch'
  }
})

export default styles
