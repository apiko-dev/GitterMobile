import React, {
  PropTypes,
  View,
  Text,
  ScrollView
} from 'react-native'
import s from '../../styles/screens/Search/SearchTabStyles.js'
import {THEMES} from '../../constants'
import Loading from '../Loading'
import SearchUserItem from './SearchUserItem'
const {colors} = THEMES.gitterDefault

const SearchUsersTab = ({isLoadingUsers, usersResult, value, onPress}) => {
  if (isLoadingUsers) {
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

  if (usersResult.length === 0) {
    return (
      <View style={s.container}>
        <Text style={s.tabText}>
          No result to display.
        </Text>
      </View>
    )
  }

  const content = usersResult.map(item => (
    <SearchUserItem
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

SearchUsersTab.propTypes = {
  isLoadingUsers: PropTypes.bool,
  usersResult: PropTypes.array,
  value: PropTypes.string,
  onPress: PropTypes.func
}

export default SearchUsersTab
