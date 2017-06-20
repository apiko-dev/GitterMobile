import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  rootStyle: {
    flex: 1
  },
  verticallyInverted: {
    flex: 1,
    transform: [
      { scaleY: -1 }
    ]
  }
})

export default styles
