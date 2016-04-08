import {StyleSheet, StatusBar} from 'react-native'
const STATUS_BAR_HEIGHT = StatusBar.currentHeight

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 8 + STATUS_BAR_HEIGHT,
    paddingBottom: 8,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 16
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
