import {StyleSheet, Platform} from 'react-native'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const iOS = Platform.OS === 'ios'

const styles = StyleSheet.create({
  mention: {
    fontWeight: 'bold'
  },
  groupMention: {
    color: '#e67e22'
  },
  selfMention: {
    color: '#e67e22'
  },
  url: {
    color: colors.link
  },
  emoji: {
    fontSize: 14
  },
  text: {
    fontSize: 14
  },
  codespan: {
    fontFamily: iOS ? 'Courier New' : 'monospace',
    color: 'green'
  }
})

export default styles
