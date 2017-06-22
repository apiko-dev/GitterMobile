import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import {Text, Linking, Alert} from 'react-native'
import Parser from 'react-native-parsed-text'
import {parseGitterGroupUrl, parseGitterMessageUrl, parseGitterRoomUrl} from '../../utils/parseUrl'
import {GITTER_REGEXPS} from '../../constants'
import Emoji from '../Emoji'
import s from './styles'

const { baseUrl, groupParamsExp, messageParamsExp, roomParamsExp } = GITTER_REGEXPS

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

const ParsedText = ({text, username, handleUrlPress, navigator}) => {
  const handleGitterRoomUrlClick = (url) => {
    const {ownerName, roomName} = parseGitterRoomUrl(url)

    navigator.push({screen: 'gm.Room'})
  }

  const handleGitterMessageUrlClick = (url) => {
    const {roomName, atParam} = parseGitterMessageUrl(url)

    navigator.push({screen: 'gm.Message', passProps: {route: {roomName, messageId: atParam}}})
  }

  const handleGitterGroupUrlClick = (url) => {
    const {groupName} = parseGitterGroupUrl(url)

    navigator.push({screen: 'gm.Home'})
  }

  const handleUrlClick = _.curry((type, url) => {
    if (!type) return Linking.openURL(url)

    Alert.alert(
      'How to open url?',
      'Select type or cancel to hide this alert.',
      [
        {text: 'Browser', onPress: () => Linking.openURL(url)},
        {text: 'Cancel'},
        {text: 'App', onPress: () => {
          switch (type) {
          case 'message': return handleGitterMessageUrlClick(url)
          case 'group': return handleGitterGroupUrlClick(url)
          case 'room': return handleGitterRoomUrlClick(url)
          default: break;
          }
        }}
      ]
    )
  })

  const patterns = [
    {pattern: new RegExp(`${baseUrl.source}${messageParamsExp.source}`), style: s.url, onPress: handleUrlClick('message')},
    {pattern: new RegExp(`${baseUrl.source}${groupParamsExp.source}`), style: s.url, onPress: handleUrlClick('group')},
    {pattern: new RegExp(`${baseUrl.source}${roomParamsExp.source}`), style: s.url, onPress: handleUrlClick('room')},
    {type: 'url', style: s.url, onPress: Linking.openUrl},
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
