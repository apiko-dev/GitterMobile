import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 80,
    padding: 20,
    paddingLeft: 20,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 16
  },
  name: {
    fontSize: 16,
    color: 'black'
  },
  userCount: {
    fontSize: 14,
    color: 'gray'
  }
})

export default styles
