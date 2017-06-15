import React, {PropTypes} from 'react';
import {Text} from 'react-native';
import Parser from 'react-native-parsed-text'
import Emoji from '../Emoji'
import s from './styles'

const MENTION_REGEX = /(([^`]|^)@([a-zA-Z0-9_\-]+))/
const GROUP_MENTION_REGEX = /^(@\/([a-zA-Z0-9_\-]+))/
const EMOJI_REGEX = /:([a-z0-9A-Z_-]+):/
const THUMBSUP = /:\+1:/
const THUMBSDOWN = /:\-1:/
const CODE_REGEX = /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/m
const IMAGE_REGEX = /!\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g

const renderEmoji = (matchingString, matches) => {
  const name = matches[0].replace(/:/g, '')
  return (
    <Emoji name={name} />
  )
}

const renderImage = (matchingString, matches) => {
  console.log(matchingString, matches)
  return <Text style={{color: 'red'}}>{`IMAGE ${matches[1]} IMAGE`}</Text>
}

const renderCodespan = (matchingString, matches) => {
  let component
  matchingString.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
  (wholeMatch, m1, m2, m3) => {
    let c = m3;
    c = c.replace(/^([ \t]*)/g, '');	// leading whitespace
    c = c.replace(/[ \t]*$/g, '');	// trailing whitespace
    component = (
      <Text> <Text style={s.codespan}>{c}</Text></Text>
    )
  })
  return component
}

const ParsedText = ({
  text,
  username,
  handleUrlPress,
  handleImagePress
}) => {
  const patterns = [
    {pattern: IMAGE_REGEX, renderText: renderImage, onPress: handleImagePress},
    {type: 'url', style: s.url, onPress: handleUrlPress},
    {pattern: new RegExp(`@${username}`), style: s.selfMention},
    {pattern: MENTION_REGEX, style: s.mention},
    {pattern: GROUP_MENTION_REGEX, style: s.groupMention},
    {pattern: EMOJI_REGEX, style: s.emoji, renderText: renderEmoji},
    {pattern: THUMBSUP, style: s.emoji, renderText: renderEmoji},
    {pattern: THUMBSDOWN, style: s.emoji, renderText: renderEmoji},
    {pattern: CODE_REGEX, renderText: renderCodespan},
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
  handleUrlPress: PropTypes.func,
  handleImagePress: PropTypes.func
}

export default ParsedText
