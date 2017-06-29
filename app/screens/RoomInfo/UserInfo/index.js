import PropTypes from 'prop-types'
import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native';
import s from '../RoomInfo/styles'

import Avatar from '../../../components/Avatar'
import Divider from '../../../components/Divider'

const RoomInfo = ({name, user, onAvatarPress}) => {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => onAvatarPress(user.avatarUrlSmall, name)}>
          <Avatar
            src={user.avatarUrlSmall}
            size={50} />
        </TouchableOpacity>
        <View style={s.headerTextContainer}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.owner}>@{user.username}</Text>
        </View>
      </View>
      <Divider />
    </View>
  )
}

RoomInfo.propTypes = {
  name: PropTypes.string,
  user: PropTypes.object,
  onAvatarPress: PropTypes.func
}

export default RoomInfo
