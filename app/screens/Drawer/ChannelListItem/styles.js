import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: 'white'
  },
  headingContainer: {
    marginLeft: 10,
    flex: 1
  },
  heading: {
    fontSize: 12,
    color: 'black'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default styles
