import React, {
  PropTypes,
  ScrollView,
  View,
  Text
} from 'react-native'
import {categorize} from '../utils/sortRoomsByType'

const ChannelList = ({ids, rooms}) => {
  if (!ids || !rooms) {
    return <Text>Nothing to display</Text>
  }

  const {unread, channels, orgs} = categorize(ids, rooms)

  const renderSection = (name, items) => (
    <View>
      <Text>{name}</Text>
      {items && items.map(item => <Text>{item.name}</Text>)}
    </View>
  )


  return (
    <ScrollView>
      {unread.length !== 0 && renderSection('Unread', unread)}
      {channels.length !== 0 && renderSection('Channels', channels)}
      {orgs.length !== 0 && renderSection('Organizations', orgs)}
    </ScrollView>
  )
}

export default ChannelList
