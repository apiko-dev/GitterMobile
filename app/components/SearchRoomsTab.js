import React, {
  PropTypes,
  View,
  Text,
  ScrollView
} from 'react-native'
import s from '../styles/SearchTabStyles.js'
import {THEMES} from '../constants'
import Loading from './Loading'
import HomeRoomItem from './HomeRoomItem'
const {colors} = THEMES.gitterDefault

const SearchRoomsTab = ({isLoadingRooms, roomsResult, value, onPress}) => {
  if (isLoadingRooms) {
    return (
      <Loading
        color={colors.brand}/>
    )
  }

  if (!value.trim()) {
    return (
      <View style={s.container} />
    )
  }

  if (roomsResult.length === 0) {
    return (
      <View style={s.container}>
        <Text style={s.tabText}>
          No result to display.
        </Text>
      </View>
    )
  }

  const content = roomsResult.map(item => (
    <HomeRoomItem
      {...item}
      onPress={onPress} />
  ))

  return (
    <View style={s.container}>
      <ScrollView>
        {content}
      </ScrollView>
    </View>
  )
}

SearchRoomsTab.propTypes = {
  isLoadingRooms: PropTypes.bool,
  roomsResult: PropTypes.array,
  value: PropTypes.string,
  onPress: PropTypes.func
}

export default SearchRoomsTab
