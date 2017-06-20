import PropTypes from 'prop-types'
import React from 'react'
import {ScrollView, Text, RefreshControl} from 'react-native';
import {categorize} from '../../../utils/sortRoomsByType'
import ChannelListSection from '../ChannelListSection'

const ChannelList = ({
  ids,
  rooms,
  activeRoom,
  onRoomPress,
  onLongRoomPress,
  isLoadingRooms,
  onRefresh,
  sectionsState,
  onToggleCollapsed
}) => {
  if (!ids || !rooms) {
    // TODO: Add tips how to add room
    return <Text>Nothing to display</Text>
  }

  const {favorites, unread, channels, orgs} = categorize(ids, rooms)

  // TODO: Use ListView instead to reduce performance issues
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isLoadingRooms}
          onRefresh={onRefresh} />
      }>
      {!!favorites.length &&
        <ChannelListSection
          onToggleCollapsed={onToggleCollapsed}
          sectionsState={sectionsState}
          name="Favorites"
          items={favorites}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress} />
      }
      {!!unread.length &&
        <ChannelListSection
          onToggleCollapsed={onToggleCollapsed}
          sectionsState={sectionsState}
          name="Unread"
          items={unread}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress} />
      }
      {!!channels.length &&
        <ChannelListSection
          onToggleCollapsed={onToggleCollapsed}
          sectionsState={sectionsState}
          name="Channels"
          items={channels}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress} />
      }
      {!!orgs.length &&
        <ChannelListSection
          onToggleCollapsed={onToggleCollapsed}
          sectionsState={sectionsState}
          name="Organizations"
          items={orgs}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress} />
      }
    </ScrollView>
  )
}

ChannelList.propTypes = {
  ids: PropTypes.array,
  onLongRoomPress: PropTypes.func,
  rooms: PropTypes.object,
  onRoomPress: PropTypes.func,
  sectionsState: PropTypes.object,
  onToggleCollapsed: PropTypes.func
}

export default ChannelList
