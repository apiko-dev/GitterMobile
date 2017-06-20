import PropTypes from 'prop-types'
import React from 'react'
import {Image, View, Text} from 'react-native';
import Button from '../../../components/Button'
import s from './styles'
import Avatar from '../../../components/Avatar'
import SearchField from '../SearchField'

import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

import Icon from 'react-native-vector-icons/MaterialIcons'

const DrawerUserInfo = ({username, displayName, avatarUrlMedium, onSettingsPress, onSearchPress}) => {
  return (
    <View style={[s.container, {
      backgroundColor: colors.raspberry,
      borderBottomColor: colors.darkRed
    }]}>
      <View style={s.topContainer}>
        <Avatar src={avatarUrlMedium} />

          <View style={s.info}>
            <Text style={[s.displayName, {color: 'white'}]}>{displayName}</Text>
            <Text style={[s.username, {color: 'white'}]}>@{username}</Text>
          </View>

          <Button
            background="SelectableBackgroundBorderless"
            style={s.buttonStyle}
            onPress={onSettingsPress}>
            <Icon name="settings" size={30} color="white" />
          </Button>

      </View>

      <SearchField
        onPress={() => onSearchPress()} />
    </View>
  )
}

DrawerUserInfo.propTypes = {
  username: PropTypes.string,
  displayName: PropTypes.string,
  avatarUrlMedium: PropTypes.string,
  onSettingsPress: PropTypes.func,
  onSearchPress: PropTypes.func
}

export default DrawerUserInfo
