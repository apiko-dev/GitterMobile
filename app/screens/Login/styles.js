import {StyleSheet, Dimensions} from 'react-native'
import backgroundImage from '../../styles/common/BackgroundImage'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    ...backgroundImage,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    color: 'white',
    backgroundColor: 'transparent'
  },
  hero: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 24,
    color: 'white',
    lineHeight: 40,
    backgroundColor: 'transparent'
  },
  buttonGroup: {
    flexDirection: 'row'
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
  }
})


export default styles
