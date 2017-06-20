import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import s from './styles'
import Button from '../../../components/Button'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

const UserInfo = ({id, company, location, email, profile, has_gitter_login: hasGitterLogin,
  onGithubPress, onEmailPress, onChatPrivatelyPress, currentUserId}) => {
  return (
    <View style={s.container}>
      {!!location && (
        <View style={s.item}>
          <MaterialIcon
            style={s.icon}
            name="location-on"
            color="black"
            size={28} />
          <View style={s.textWrapper}>
            <Text style={s.text}>{location}</Text>
          </View>
        </View>
      )}
      {!!company && (
        <View style={s.item}>
          <MaterialIcon
            style={s.icon}
            name="business"
            color="black"
            size={28} />
          <View style={s.textWrapper}>
            <Text style={s.text}>{company}</Text>
          </View>
        </View>
      )}
      {!!email && (
        <View style={s.center}>
          <Button
            style={s.button}
            onPress={() => onEmailPress(email)}>
            <MaterialIcon
              style={s.icon}
              name="email"
              color="black"
              size={28} />
            <Text style={s.text}>Send e-mail</Text>
          </Button>
        </View>
      )}
      {!!profile && (
        <View style={s.center}>
          <Button
            style={s.button}
            onPress={() => onGithubPress(profile)}>
            <FontAwesomeIcon
              style={s.icon}
              name="github"
              color="black"
              size={28} />
            <Text style={s.text}>Github profile</Text>
          </Button>
        </View>
      )}
      {!!hasGitterLogin && hasGitterLogin === true && currentUserId !== id && (
        <View style={s.center}>
          <Button
            style={[s.button, s.chatPrivately]}
            onPress={() => onChatPrivatelyPress(id)}>
            <MaterialIcon
              style={s.icon}
              name="textsms"
              color="black"
              size={28} />
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
