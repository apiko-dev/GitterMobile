import React, {
  PropTypes,
  TouchableNativeFeedback,
  Image,
  View,
  Text
} from 'react-native'
import s from '../styles/DrawerUserInfoStyles'
import Avatar from './Avatar'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault


const DrawerUserInfo = ({username, displayName, avatarUrlMedium}) => {
  return (
    <View style={[s.container,
      {
        backgroundColor: colors.raspberry,
        borderBottomColor: colors.darkRed
      }
    ]}>
      <Avatar src={avatarUrlMedium} />

        <View style={s.info}>
          <Text style={[s.displayName, {color: 'white'}]}>{displayName}</Text>
          <Text style={[s.username, {color: 'white'}]}>@{username}</Text>
        </View>
        <TouchableNativeFeedback
           background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          onPress={() => console.warn('popup')}>
          <View style={s.buttonStyle}>
            <Image
              source={require('image!ic_more_vert_white_24dp')}
              style={s.icon} />
          </View>
        </TouchableNativeFeedback>

    </View>
  )
}

DrawerUserInfo.propTypes = {
  username: PropTypes.string,
  displayName: PropTypes.string,
  avatarUrlMedium: PropTypes.string
}

export default DrawerUserInfo
