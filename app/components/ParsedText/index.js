import PropTypes from 'prop-types'
import React from 'react'
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

const renderEmoji = (matchingString, matches) => {
  const name = matches[0].replace(/:/g, '')
  return (
    <Emoji name={name} />
  )
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

const ParsedText = ({text, username, handleUrlPress}) => {
  const patterns = [
    {type: 'url', style: s.url, onPress: handleUrlPress},
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
  handleUrlPress: PropTypes.func
}

export default ParsedText
