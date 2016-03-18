import React, {
  PropTypes,
  View,
  Image,
  Text
} from 'react-native'
import s from '../../styles/UserInfoStyles'
import Link from '../Link'


const UserInfo = ({company, location, email, profile}) => {
  return (
    <View style={s.container}>
      {!!location && (
        <View style={s.item}>
          <Image
            source={require('image!ic_arrow_back_black_24dp')}
            style={s.icon} />
          <Text style={s.text}>{location}</Text>
        </View>
      )}
      {!!company && (
        <View style={s.item}>
          <Image
            source={require('image!ic_arrow_back_black_24dp')}
            style={s.icon} />
          <Text style={s.text}>{company}</Text>
        </View>
      )}
      {!!email && (
        <View style={s.item}>
          <Image
            source={require('image!ic_arrow_back_black_24dp')}
            style={s.icon} />
          <Link to={email}>{email}</Link>
        </View>
      )}
      {!!profile && (
        <View style={s.item}>
          <Image
            source={require('image!ic_arrow_back_black_24dp')}
            style={s.icon} />
          <Link to={profile}>{profile}</Link>
        </View>
      )}
    </View>
  )
}

UserInfo.propTypes = {
  company: PropTypes.string,
  location: PropTypes.string,
  email: PropTypes.string,
  profile: PropTypes.string
}

export default UserInfo
