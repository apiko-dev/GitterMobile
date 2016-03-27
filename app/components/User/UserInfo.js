import React, {
  PropTypes,
  View,
  Image,
  Text
} from 'react-native'
import s from '../../styles/screens/User/UserInfoStyles'
import Button from '../Button'


const UserInfo = ({id, company, location, email, profile, has_gitter_login,
  onGithubPress, onEmailPress, onChatPrivatelyPress, currentUserId}) => {
  return (
    <View style={s.container}>
      {!!location && (
        <View style={s.item}>
          <Image
            source={require('image!ic_location_on_black_24dp')}
            style={s.icon} />
          <View style={s.textWrapper}>
            <Text style={s.text}>{location}</Text>
          </View>
        </View>
      )}
      {!!company && (
        <View style={s.item}>
          <Image
            source={require('image!ic_business_black_24dp')}
            style={s.icon} />
          <View style={s.textWrapper}>
            <Text style={s.text}>{company}</Text>
          </View>
        </View>
      )}
      {!!email && (
        <View style={s.center}>
          <Button
            styles={s.button}
            onPress={() => onEmailPress(email)}>
            <Image
              source={require('image!ic_email_black_24dp')}
              style={s.icon} />
            <Text style={s.text}>Send e-mail</Text>
          </Button>
        </View>
      )}
      {!!profile && (
        <View style={s.center}>
          <Button
            styles={s.button}
            onPress={() => onGithubPress(profile)}>
            <Image
              source={require('image!ic_github_24dp')}
              style={s.icon} />
            <Text style={s.text}>Github profile</Text>
          </Button>
        </View>
      )}
      {!!has_gitter_login && has_gitter_login === true && currentUserId !== id && (
        <View style={s.center}>
          <Button
            styles={[s.button, s.chatPrivately]}
            onPress={() => onChatPrivatelyPress(id)}>
            <Image
              source={require('image!ic_textsms_black_24dp')}
              style={s.icon} />
            <Text style={s.text}>Chat privately</Text>
          </Button>
        </View>
      )}
    </View>
  )
}

UserInfo.propTypes = {
  id: PropTypes.string,
  company: PropTypes.string,
  location: PropTypes.string,
  email: PropTypes.string,
  profile: PropTypes.string,
  has_gitter_login: PropTypes.bool,
  currentUserId: PropTypes.string,
  onGithubPress: PropTypes.func,
  onEmailPress: PropTypes.func,
  onChatPrivatelyPress: PropTypes.func
}

export default UserInfo
