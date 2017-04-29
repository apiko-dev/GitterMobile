import {StyleSheet, Platform} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: Platform.OS === 'ios' ? 24 : 0,
  },
  bottomContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 2,
    backgroundColor: 'white',
    elevation: 2
  }
})

export default styles
