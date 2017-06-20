import {StyleSheet} from 'react-native'
const height = 48

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    height,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    margin: 4,
    backgroundColor: 'white',
    elevation: 2
  },
  button: {
    elevation: 0,
    width: 56,
    height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonIcon: {
    width: 25,
    height: 25,
    opacity: 0.6
  },
  textInput: {
    flex: 1,
    height,
    backgroundColor: 'white',
    fontSize: 18
  }
})

export default styles
