import {StyleSheet} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

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
  text: {
    textAlign: 'center',
    fontSize: 14,
    paddingTop: 16
  },
  textInput: {
    color: 'white',
    height: 24,
    fontSize: 18,
    alignSelf: 'stretch'
  }
})

export default styles
