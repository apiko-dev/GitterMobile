import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',

    flex: 1
  },
  scrollContainer: {

    justifyContent: 'center',
    alignItems: 'center'
  },
  toolbar: {
    height: 56,
    elevation: 8
  },
  welcome: {

    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    paddingBottom: 20
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  heading: {
    flex: 1
  },
  headingBgImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})

export default styles
