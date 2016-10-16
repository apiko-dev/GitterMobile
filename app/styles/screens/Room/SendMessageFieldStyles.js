import {StyleSheet} from 'react-native'

const padding = 12
const button = 35
const buttonMargin = 8

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: padding,
    // marginVertical: 4,
    backgroundColor: 'white',
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)'
  },
  innerContainer: {
    flex: 1
  },
  textInput: {
    paddingVertical: 4,
    backgroundColor: 'white',
    fontSize: 14,
    textAlignVertical: 'center'
  },
  button: {
    height: button,
    margin: buttonMargin,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendIcon: {
    width: 30,
    height: 30
  },
  hidden: {
    position: 'absolute',
    top: 10000,  // way off screen
    left: 10000, // way off screen
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: 'transparent',
  }
})

export default style
