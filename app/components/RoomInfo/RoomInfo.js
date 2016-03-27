import React, {
  PropTypes,
  View,
  Text
} from 'react-native'
import s from '../../styles/screens/RoomInfo/RoomInfoStyles'

import {createGhAvatarLink} from '../../utils/links'
import channelNameAndOwner from '../../utils/channelNameAndOwner'

import Avatar from '../Avatar'
import Divider from '../Divider'

const RoomInfo = ({name}) => {
  const avatarSrc = createGhAvatarLink(name.split('/')[0], 200)
  const channel = channelNameAndOwner(name)

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Avatar
          src={avatarSrc}
          size={50} />
        {!channel.name
          ? (
          <View style={s.headerTextContainer}>
            <Text style={s.name}>{channel.owner}</Text>
          </View>
        ) : (
          <View style={s.headerTextContainer}>
            <Text style={s.name}>{channel.name}</Text>
            <Text style={s.owner}>by {channel.owner}</Text>
          </View>
        )}
      </View>
      <Divider />
    </View>
  )
}

RoomInfo.propTypes = {
  name: PropTypes.string
}

export default RoomInfo
