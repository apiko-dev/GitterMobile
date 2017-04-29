import {StyleSheet} from 'react-native'
import backgroundImage from '../../styles/common/BackgroundImage'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    ...backgroundImage,
    flex: 1,
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // padding: 16
  },
  logo: {
    marginTop: 40,
    fontSize: 40,
    color: 'white',
    textAlign: 'center'
  },
  hero: {
    marginTop: 40,
    marginHorizontal: 20,
    fontSize: 24,
    color: 'white',
    lineHeight: 40,
    backgroundColor: 'transparent'
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
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  textfield: {
    marginVertical: 10,
    marginHorizontal: 20,
    // width: 250,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 8
  }
})


export default styles
