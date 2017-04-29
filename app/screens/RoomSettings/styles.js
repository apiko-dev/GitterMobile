import {StyleSheet, Platform} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault
const iOS = Platform.OS === 'ios'

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
  itemStyle: {
    fontSize: 12
  },
  picker: {
    height: iOS ? 110 : 50,
    overflow: 'hidden',
    justifyContent: 'space-around',
    marginHorizontal: 8
  },
  buttonStyle: {
    margin: 10,
    backgroundColor: colors.primaryButton,
    width: 150,
    height: 40,
    borderRadius: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
})

export default styles
