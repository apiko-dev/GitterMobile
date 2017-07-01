import {StyleSheet} from 'react-native'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault


const styles = StyleSheet.create({
  container: {
    height: 52,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0eef0'
  },
  text: {
    color: colors.raspberry,
    fontSize: 18
  }

})

export default styles
