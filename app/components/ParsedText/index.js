import React, {PropTypes} from 'react'
import Parser from 'react-native-parsed-text'
import renderEmoji from './renderEmoji'
import renderImage from './renderImage'
import renderImageLink from './renderImageLink'
import renderLink from './renderLink'
import renderCodespan from './renderCodespan'
import s from './styles'

const MENTION_REGEX = /(([^`]|^)@([a-zA-Z0-9_\-]+))/
const GROUP_MENTION_REGEX = /^(@\/([a-zA-Z0-9_\-]+))/
const EMOJI_REGEX = /:([a-z0-9A-Z_-]+):/
const THUMBSUP = /:\+1:/
const THUMBSDOWN = /:\-1:/
const CODE_REGEX = /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/m
const IMAGE_REGEX = /!\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g
const LINK = /\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g
const IMAGE_LINK = /!\[(.*?)|(\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\))]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g

const ParsedText = ({
  text,
  username,
  onUrlPress,
  onImagePress
}) => {
  const patterns = [
    {pattern: LINK, renderText: renderLink, onPress: rawText => onUrlPress(LINK.exec(rawText)[3])},
    {pattern: IMAGE_REGEX, renderText: renderImage, onPress: rawText => onImagePress(IMAGE_REGEX.exec(rawText))},
    {pattern: IMAGE_LINK, renderText: renderImageLink, onPress: rawText => onImagePress(IMAGE_REGEX.exec(rawText), true)},
    {type: 'url', style: s.url, onPress: onUrlPress},
    {pattern: new RegExp(`@${username}`), style: s.selfMention},
    {pattern: MENTION_REGEX, style: s.mention},
    {pattern: GROUP_MENTION_REGEX, style: s.groupMention},
    {pattern: EMOJI_REGEX, style: s.emoji, renderText: renderEmoji},
    {pattern: THUMBSUP, style: s.emoji, renderText: renderEmoji},
    {pattern: THUMBSDOWN, style: s.emoji, renderText: renderEmoji},
    {pattern: CODE_REGEX, renderText: renderCodespan}
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
  onUrlPress: PropTypes.func,
  onImagePress: PropTypes.func
}

export default ParsedText
