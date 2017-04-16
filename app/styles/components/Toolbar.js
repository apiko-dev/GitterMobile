import {StyleSheet} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  container: {
    height: 64,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // alignSelf: 'stretch'
    justifyContent: 'space-between'
  },
  titleContainer: {
    // flex: 1,
    // backgroundColor: 'gray',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  iconButton: {
    backgroundColor: colors.raspberry,
    // marginHorizontal: 4,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    width: 44,
    justifyContent: 'center'
  },
  showIcon: {
    // marginRight: 4
  },
  icon: {
    width: 25,
    height: 25
  },
  addContainer: {
    // paddingHorizontal: 8,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    width: 44,
    justifyContent: 'flex-end',
    // alignSelf: 'flex-end'
  },
  addContainerInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconTitle: {
    color: '#FFF',
    paddingRight: 20,
    fontSize: 20
  },
  childrenContainer: {
    flex: 1
  }
})

export default styles
