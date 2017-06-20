import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import s from './styles'

const UnreadBadge = ({mentions, unreadItems, lurk}) => {
  if (!!mentions) {
    return (
      <View style={[s.container, s.mention]}>
        <Text style={s.text}>@</Text>
      </View>
    )
  } else if (lurk) {
    return (
      <View style={s.container}>
        <View style={s.lurk} />
      </View>
    )
  } else {
    return (
      <View style={[s.container, s.unread]}>
        <Text style={s.text}>{unreadItems}</Text>
      </View>
    )
  }
}

UnreadBadge.propTypes = {
  mentions: PropTypes.number,
  unreadItems: PropTypes.number,
  lurk: PropTypes.bool
}

export default UnreadBadge
