import React, {PropTypes} from 'react-native'
import Parser from 'react-native-parsed-text'
import s from '../styles/ParsedTextStyles'

const MENTION_REGEX = /(@([a-zA-Z0-9_\-]+))/g


const ParsedText = ({text, handleUrlPress}) => {
  const patterns = [
    {type: 'url', style: s.url, onPress: handleUrlPress},
    {pattern: MENTION_REGEX, style: s.mention}
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
