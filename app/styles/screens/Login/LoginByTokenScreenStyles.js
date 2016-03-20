import {StyleSheet} from 'react-native'
import backgroundImage from '../../common/BackgroundImage'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    ...backgroundImage,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  logo: {
    fontSize: 40,
    color: 'white'
  },
  hero: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 24,
    color: 'white',
    lineHeight: 40
  },
  group: {
    // flexDirection: 'column'
  },
  buttonStyle: {
    margin: 10,
    backgroundColor: colors.primaryButton,
    width: 150,
    height: 40,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  textfield: {
    width: 250,
    height: 40
  }
})


export default styles
