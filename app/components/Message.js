import React, {
  PropTypes,
  View,
  Text
} from 'react-native'
import s from '../styles/MessageStyles'

import Avatar from './Avatar'

const Message = ({text, fromUser, ...props}) => {
  const opacity = props.hasOwnProperty('sending') && props.sending === true ? 0.4 : 1

  // TODO: When sending failed we need to display danger background,
  // instead it displays opacity 0.4, coz it does not updates
  const backgroundColor = props.hasOwnProperty('failed') && props.failed === true ? 'red' : 'transparent'

  return (
    <View style={[s.container, {opacity, backgroundColor}]}>
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
  fromUser: PropTypes.object,
  sending: PropTypes.bool,
  failed: PropTypes.bool
}

export default Message
