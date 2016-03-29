import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  button: {
    flex: 1,
    elevation: 0,
    flexDirection: 'row',
    height: 70,
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    paddingVertical: 16
  },
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    flexWrap: 'wrap'
  },
  userInfo: {
    flex: 1,
    paddingLeft: 18,
    flexDirection: 'column'
  },
  displayName: {
    fontSize: 18,
    color: 'black'
  },
  icon: {
    width: 30,
    height: 30,
    opacity: 0.6
  },
  addIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0
  }
})

export default styles
