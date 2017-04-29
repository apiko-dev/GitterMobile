import {StyleSheet, Platform} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: Platform.OS === 'ios' ? 24 : 0,

  },
  bottomContainer: {
    flex: 1,
    borderRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
    margin: 4
  }
})

export default styles
