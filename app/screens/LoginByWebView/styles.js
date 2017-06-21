import {StyleSheet} from 'react-native'
import backgroundImage from '../../styles/common/BackgroundImage'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    ...backgroundImage,
    flex: 1,
    justifyContent: 'center'
  },
  logo: {
    fontSize: 40,
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 20
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})


export default styles
