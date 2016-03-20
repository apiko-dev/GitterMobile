import React, {PropTypes} from 'react-native'
import Parser from 'react-native-parsed-text'
import Emoji from './Emoji'
import s from '../styles/components/ParsedTextStyles'

const MENTION_REGEX = /(([^`]|^)@([a-zA-Z0-9_\-]+))/g
const GROUP_MENTION_REGEX = /^(@\/([a-zA-Z0-9_\-]+))/
const EMOJI_REGEX = /:([a-z0-9A-Z_-]+):/
const THUMBSUP = /:\+1:/g
const THUMBSDOWN = /:\-1:/g

const renderEmoji = (matchingString, matches) => {
  const name = matches[0].replace(/:/g, '')
  return (
    <Emoji name={name} />
  )
}

const ParsedText = ({text, username, handleUrlPress}) => {
  const patterns = [
    {type: 'url', style: s.url, onPress: handleUrlPress},
    {pattern: new RegExp(`@${username}`), style: s.selfMention},
    {pattern: MENTION_REGEX, style: s.mention},
    {pattern: GROUP_MENTION_REGEX, style: s.groupMention},
    {pattern: EMOJI_REGEX, style: s.emoji, renderText: renderEmoji},
    {pattern: THUMBSUP, style: s.emoji, renderText: renderEmoji},
    {pattern: THUMBSDOWN, style: s.emoji, renderText: renderEmoji}
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
