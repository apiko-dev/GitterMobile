import {StyleSheet} from 'react-native'

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5
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
    // justifyContent: 'space-between'
  },
  username: {
    fontWeight: 'bold'
  },
  bottom: {

  },
  text: {
    fontSize: 14
  },
  deleted: {
    fontStyle: 'italic',
    opacity: 0.8
  },
  date: {
    marginLeft: 4,
    fontSize: 14
  },
  url: {
    color: 'blue'
  },
  readStatus: {
    width: 15,
    marginTop: 3
  },
  readStatusIcon: {
    width: 15,
    height: 15
  }
})

export default style
