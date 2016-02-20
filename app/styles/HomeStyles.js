import {StyleSheet} from 'react-native'
import ExtraDimensions from 'react-native-extra-dimensions-android'
const STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT')

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',

    flex: 1
  },
  scrollContainer: {

    justifyContent: 'center',
    alignItems: 'center'
  },
  toolbar: {
    marginTop: STATUS_BAR_HEIGHT,
    height: 56,
    elevation: 8
  },
  welcome: {

    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    paddingBottom: 20
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
