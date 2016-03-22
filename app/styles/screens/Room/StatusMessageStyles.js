import {StyleSheet} from 'react-native'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

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
  text: {
    fontSize: 14,
    color: 'purple'
  },
  url: {
    color: colors.link
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
