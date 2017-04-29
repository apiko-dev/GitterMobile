import {StyleSheet} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',

    flex: 1,
  },
  scrollContainer: {
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  toolbar: {
    height: 56,
    backgroundColor: colors.raspberry,
    elevation: 4
  },
  welcome: {

    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    paddingBottom: 20
  },
  loadingWrap: {
    height: 200
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  heading: {
    flex: 1
  },
  foreground: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottom: {
    flex: 1,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    paddingTop: 20
  },
  bottomSectionHeading: {
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
    marginLeft: 20
  }
})

export default styles
