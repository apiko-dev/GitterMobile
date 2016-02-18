import React, {
  PropTypes,
  TouchableNativeFeedback,
  View,
  Text
} from 'react-native'
import s from '../styles/DrawerUserInfoStyles'
import Avatar from './Avatar'
import {MKButton} from 'react-native-material-kit'

const DrawerUserInfo = ({username, displayName, avatarUrlMedium}) => {
  return (
    <View style={s.container}>
      <Avatar src={avatarUrlMedium} />
      <View style={s.info}>
        <Text style={s.displayName}>{displayName}</Text>
        <Text style={s.username}>@{username}</Text>
      </View>
      <MKButton
        style={s.buttonStyle}
        onPress={() => console.warn('popup')}>
        <Image src={require('image!ic_more_vert_white_24dp')} />
      </MKButton>
    </View>
  )
}

DrawerUserInfo.propTypes = {
  username: PropTypes.string,
  displayName: PropTypes.string,
  avatarUrlMedium: PropTypes.string
}

export default DrawerUserInfo
