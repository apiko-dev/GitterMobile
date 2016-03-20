import React, {PropTypes, ScrollView, Text} from 'react-native'
import {categorize} from '../../utils/sortRoomsByType'
import ChannelListSection from './ChannelListSection'

const ChannelList = ({ids, rooms, activeRoom, onRoomPress, onLongRoomPress}) => {
  if (!ids || !rooms) {
    // TODO: Add tips how to add room
    return <Text>Nothing to display</Text>
  }

  const {unread, channels, orgs} = categorize(ids, rooms)

  // TODO: Use ListView instead to reduce performance issues
  return (
    <ScrollView>
      {!!unread.length &&
        <ChannelListSection
          name="Unread"
          items={unread}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress}/>
      }
      {!!channels.length &&
        <ChannelListSection
          name="Channels"
          items={channels}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress}/>
      }
      {!!orgs.length &&
        <ChannelListSection
          name="Organizations"
          items={orgs}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress}/>
      }
    </ScrollView>
  )
}

ChannelList.propTypes = {
  ids: PropTypes.array,
  onLongRoomPress: PropTypes.func,
  rooms: PropTypes.object,
  onRoomPress: PropTypes.func
}

export default ChannelList
