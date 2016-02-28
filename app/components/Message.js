import React, {
  PropTypes,
  View,
  Text
} from 'react-native'
import s from '../styles/MessageStyles'

import Avatar from './Avatar'

const Message = ({text, fromUser}) => {
  return (
    <View style={s.container}>
      <Avatar src={fromUser.avatarUrlSmall} size={30} />
      <View style={s.content}>
        <View style={s.top}>
          <Text style={s.username}>{fromUser.username}</Text>
          <Text>Date</Text>
        </View>
        <View style={s.bottom}>
          <Text style={s.text}>{text}</Text>
        </View>
      </View>
    </View>
  )
}

Message.propTypes = {
  text: PropTypes.string,
  fromUser: PropTypes.object
}

export default Message
