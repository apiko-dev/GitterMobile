import React, {
  PropTypes,
  TouchableNativeFeedback,
  Image,
  View,
  Text
} from 'react-native'
import s from '../../styles/screens/Drawer/DrawerUserInfoStyles'
import Avatar from '../Avatar'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault


const DrawerUserInfo = ({username, displayName, avatarUrlMedium, onLogOut}) => {
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
          onPress={onLogOut}>
          <View style={s.buttonStyle}>
            <Image
              source={require('image!ic_exit_to_app_white_24dp')}
              style={s.icon} />
          </View>
        </TouchableNativeFeedback>

    </View>
  )
}

DrawerUserInfo.propTypes = {
  username: PropTypes.string,
  displayName: PropTypes.string,
  avatarUrlMedium: PropTypes.string,
  onLogOut: PropTypes.func
}

export default DrawerUserInfo
