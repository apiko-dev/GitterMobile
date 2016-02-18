import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    height: 54,
    paddingTop: 10,
    paddingBottom: 10,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  info: {
    marginLeft: 20,
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
