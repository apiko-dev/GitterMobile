import {StyleSheet} from 'react-native'

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginLeft: 15
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: 'bold'
  },
  bottom: {

  },
  text: {
    fontSize: 14
  }
})

export default style
