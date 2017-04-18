import {StyleSheet, Dimensions} from 'react-native'
const {height} = Dimensions.get('window')
const TOOLBAR_HEIGHT = 56 + 24
const BOTTOM_BAR_HEIGHT = 56

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height - TOOLBAR_HEIGHT - BOTTOM_BAR_HEIGHT,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 15
  },
  heading: {
    fontSize: 24
  },
  text: {
    fontSize: 14
  }
})

export default styles
