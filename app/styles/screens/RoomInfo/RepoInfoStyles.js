import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    // flex: 1
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 24
  },
  headerTextContainer: {
    marginLeft: 16,
    flexDirection: 'column'
  },
  name: {
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  description: {

  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItemContainer: {
    alignItems: 'center',
    width: 75
  },
  button: {
    height: 48,
    elevation: 0
  }
})

export default styles
