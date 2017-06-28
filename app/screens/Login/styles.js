import {StyleSheet, Dimensions} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.raspberry,
    justifyContent: 'center',
    alignItems: 'center'
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
    position: 'absolute',
    bottom: 20
  },
  buttonStyle: {
    backgroundColor: 'white',
    marginBottom: 16,
    height: 35,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  buttonText: {
    fontWeight: 'bold',
    paddingHorizontal: 40,
    color: colors.raspberry
  }
})


export default styles
