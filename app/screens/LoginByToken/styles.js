import {StyleSheet} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16
  },
  buttonContainer: {
    alignSelf: 'center'
  },
  buttonStyle: {
    margin: 16,
    backgroundColor: colors.raspberry,
    paddingHorizontal: 40,
    marginBottom: 40,
    height: 35,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  textfield: {
    height: 40,
    backgroundColor: 'white',
    paddingLeft: 0,
    color: colors.raspberry
  },
  textfieldContainer: {
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.raspberry
  },
  hint: {
    color: colors.secondaryFont
  },
  error: {
    color: colors.red,
    marginBottom: 16,
    fontSize: 18
  }
})


export default styles
