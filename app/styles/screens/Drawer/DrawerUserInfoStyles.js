import {StyleSheet} from 'react-native'
import ExtraDimensions from 'react-native-extra-dimensions-android'
const STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT')
const styles = StyleSheet.create({
  container: {
    height: 56 + STATUS_BAR_HEIGHT,
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6
  },
  info: {
    marginLeft: 16,
    width: 165
  },
  displayName: {
    fontSize: 16
  },
  buttonStyle: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 20,
    height: 20
  }
})

export default styles
