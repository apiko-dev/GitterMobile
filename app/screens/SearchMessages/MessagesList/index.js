import PropTypes from 'prop-types'
import React from 'react'
import {ScrollView} from 'react-native'
import Message from '../../Room/Message'

const MessagesList = ({
  items,
  onLongPress,
  onPress,
  onUserAvatarPress
}) => (
  <ScrollView
    keyboardShouldPersistTaps="handled">
    {items.map(item =>
      <Message
        {...item}
        onLongPress={onLongPress}
        onPress={onPress}
        onUserAvatarPress={onUserAvatarPress}
        onLayout={() => {}}
        key={item.id} />
    )}
  </ScrollView>
)

MessagesList.propTypes = {
  items: PropTypes.array,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  onUserAvatarPress: PropTypes.func
}

export default MessagesList
