import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center'
  },
  avatarWrapper: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  displayNameWapper: {
    height: 50,
    alignItems: 'center',
    marginBottom: 15
  },
  displayName: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold'
  },
  username: {
    fontSize: 18
  },
  github: {
    height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  githubItem: {
    margin: 15
  },
  githubItemText: {
    fontSize: 18
  },
  bold: {
    fontWeight: 'bold'
  }
})

export default styles
