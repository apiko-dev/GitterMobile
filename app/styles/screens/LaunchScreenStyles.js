import {StyleSheet} from 'react-native'
import backgroundImage from '../common/BackgroundImage'

const styles = StyleSheet.create({
  container: {
    ...backgroundImage,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  logo: {
    fontSize: 40,
    color: 'white'
  }
})


export default styles
