import {StyleSheet} from 'react-native'
import backgroundImage from '../../styles/common/BackgroundImage'

const styles = StyleSheet.create({
  container: {
    ...backgroundImage,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  logo: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white'
  },
  buttonStyle: {
    margin: 10,
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
