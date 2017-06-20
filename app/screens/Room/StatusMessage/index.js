import PropTypes from 'prop-types'
import React from 'react'
import {View} from 'react-native';
import Parser from 'react-native-parsed-text'
import Icon from 'react-native-vector-icons/MaterialIcons'

import s from './styles'
import Button from '../../../components/Button'
import renderEmoji from './renderEmoji'

const EMOJI_REGEX = /:([a-z0-9A-Z_-]+):/
const THUMBSUP = /:\+1:/
const THUMBSDOWN = /:\-1:/

const StatusMessage = ({onPress, onLongPress, text, handleUrlPress, backgroundColor, opacity, onLayout}) => {
  const patterns = [
    {type: 'url', style: s.url, onPress: handleUrlPress},
    {pattern: EMOJI_REGEX, style: s.emoji, renderText: renderEmoji},
    {pattern: THUMBSUP, style: s.emoji, renderText: renderEmoji},
    {pattern: THUMBSDOWN, style: s.emoji, renderText: renderEmoji}
  ]

  return (
    <Button
      style={[s.container, {backgroundColor}]}
      onPress={() => onPress()}
      onLayout={e => onLayout(e)}
      onLongPress={() => onLongPress()}>
      <View style={{
        width: 30
      }} />
      <View style={s.content}>
        <View>
          <Parser
            style={s.text}
            parse={patterns}>
            {text}
          </Parser>
        </View>
      </View>
      <View style={s.readStatus}>
        <Icon
          style={{opacity}}
          name="done"
          color="black"
          size={15} />
      </View>
    </Button>
  )
}

StatusMessage.propTypes = {
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  text: PropTypes.string,
  handleUrlPress: PropTypes.func,
  backgroundColor: PropTypes.string,
  opacity: PropTypes.number
}

export default StatusMessage
