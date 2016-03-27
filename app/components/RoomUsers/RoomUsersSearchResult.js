import React, {
  PropTypes,
  View,
  Text,
  ScrollView
} from 'react-native'
import s from '../../styles/screens/RoomUsers/RoomUsersSearchResultStyles'

import RoomUserItem from './RoomUserItem'
import Loading from '../Loading'

const RoomUsersSearchResult = ({resultItems, onUserItemPress, isLoading}) => {
  if (isLoading) {
    return (
      <View style={s.container}>
        <View style={s.loading}>
          <Loading />
        </View>
      </View>
    )
  }

  if (resultItems.length === 0) {
    return (
      <View style={s.container}>
        <View style={s.noResultContainer}>
          <Text style={s.noResult}>No result</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={s.container}>
      <ScrollView>
        {resultItems.map(item => (
          <RoomUserItem
            {...item}
            onUserItemPress={onUserItemPress} />
        ))}
      </ScrollView>
    </View>
  )
}

RoomUsersSearchResult.propTypes = {
  resultItems: PropTypes.array,
  onUserItemPress: PropTypes.func,
  isLoading: PropTypes.bool
}

export default RoomUsersSearchResult
