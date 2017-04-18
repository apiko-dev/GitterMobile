import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center'
  },
  avatarWrapper: {
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  displayNameWapper: {
    // flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  displayName: {
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold'
  },
  username: {
    fontSize: 18
  },
  github: {
    // height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  githubItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15
  },
  githubItemText: {
    fontSize: 18
  },
  bold: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default styles
