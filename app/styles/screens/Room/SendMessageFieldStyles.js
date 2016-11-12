import {StyleSheet} from 'react-native'

const padding = 16
const button = 46
const buttonMargin = 8

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: padding,
    paddingRight: 4,
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
  rightButtons: {
    width: 90,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: 'red'
  },
  button: {
    // backgroundColor: 'gray',
    height: button,
    width: button,
    // margin: buttonMargin,
    alignItems: 'center',
    justifyContent: 'center'
  },
  left: {
    // marginRight: 4,
    // backgroundColor: 'pink',
    opacity: 0.8
  },
  sendIcon: {
    width: 32,
    height: 32
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
