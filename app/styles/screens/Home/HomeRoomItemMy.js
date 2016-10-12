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
  headingContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10
  },
  heading: {
    fontSize: 16,
    color: 'black'
  },
  userCount: {
    fontSize: 14,
    color: 'gray'
  },
  unread: {
    alignSelf: 'flex-end'
  }
})

export default styles
//
//   container: {
//     height: 80,
//     padding: 20,
//     paddingLeft: 20,
//     alignSelf: 'stretch',
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center'
//   },
//   infoContainer: {
//     flexDirection: 'column',
//     marginLeft: 16
//   },
//   name: {
//     fontSize: 16,
//     color: 'black'
//   },
//   userCount: {
//     fontSize: 14,
//     color: 'gray'
//   }
// })
