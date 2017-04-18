import {StyleSheet} from 'react-native'
import {THEMES} from '../../constants'

const {colors} = THEMES.gitterDefault

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  tabsContainer: {
    flex: 1
  },
  toolbar: {
    height: 56,
    backgroundColor: colors.raspberry
  },
  toolbarContainer: {
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  tabs: {
    elevation: 4
  },
  textInput: {
    color: 'white',
    height: 24,
    fontSize: 18,
    alignSelf: 'stretch'
  }
})

export default styles
