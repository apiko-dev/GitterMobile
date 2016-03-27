import React, {
  PropTypes,
  View,
  Text,
  ScrollView
} from 'react-native'
import s from '../../styles/screens/RoomUserAdd/SearchResultStyles'

import RoomUserItem from './RoomUserItem'
import Loading from '../Loading'

const SearchResult = ({resultItems, onUserItemPress, isLoading, onAddPress}) => {
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
            noButton={!!item.has_gitter_login ? true : false}
            onAddPress={onAddPress}
            onUserItemPress={onUserItemPress} />
        ))}
      </ScrollView>
    </View>
  )
}

SearchResult.propTypes = {
  resultItems: PropTypes.array,
  onUserItemPress: PropTypes.func,
  isLoading: PropTypes.bool,
  onAddPress: PropTypes.func
}

export default SearchResult
