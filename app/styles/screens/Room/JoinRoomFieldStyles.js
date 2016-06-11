import {StyleSheet} from 'react-native'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault


const styles = StyleSheet.create({
  container: {
    height: 56,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    backgroundColor: 'white'
  },
  text: {
    color: colors.raspberry,
    fontSize: 18
  }

})

export default styles
