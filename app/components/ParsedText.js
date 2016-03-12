import React, {PropTypes} from 'react-native'
import Parser from 'react-native-parsed-text'
import s from '../styles/ParsedTextStyles'

const MENTION_REGEX = /(([^`]|^)@([a-zA-Z0-9_\-]+))/g
const GROUP_MENTION_REGEX = /^(@\/([a-zA-Z0-9_\-]+))/

const ParsedText = ({text, username, handleUrlPress}) => {
  const patterns = [
    {type: 'url', style: s.url, onPress: handleUrlPress},
    {pattern: new RegExp(`@${username}`), style: s.selfMention},
    {pattern: MENTION_REGEX, style: s.mention},
    {pattern: GROUP_MENTION_REGEX, style: s.groupMention}
  ]

  return (
    <Parser
      style={s.text}
      parse={patterns}>
      {text}
    </Parser>
  )
}

ParsedText.propTypes = {
  text: PropTypes.string,
  handleUrlPress: PropTypes.func
}

export default ParsedText
