import React, {
  Component,
  PropTypes,
  Alert,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import {onLogOut} from '../modules/auth'
import {selectRoom} from '../modules/rooms'
import s from '../styles/DrawerStyles'
import DrawerUserInfo from '../components/DrawerUserInfo'
import ChannelList from '../components/ChannelList'
import Loading from '../components/Loading'

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

class Drawer extends Component {
  constructor(props) {
    super(props)
    this.onRoomPress = this.onRoomPress.bind(this)
  }

  onRoomPress(id) {
    this.props.navigator({name: 'room', roomId: id})
    this.props.dispatch(selectRoom(id))
  }

  onLogOut() {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => this.props.dispatch(onLogOut())}
      ]
    )
  }

  render() {
    const {user, ids} = this.props

    return (
      <View style={[s.container, {backgroundColor: colors.gray}]}>
        <DrawerUserInfo {...user} onLogOut={this.onLogOut.bind(this)}/>
        {ids.length === 0
          ? <Loading color={colors.brand} />
        : <ChannelList {...this.props} onRoomPress={this.onRoomPress.bind(this)}/>}
      </View>
    )
  }
}

Drawer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoadingUser: PropTypes.bool,
  isLoadingRooms: PropTypes.bool,
  navigator: PropTypes.func.isRequired,
  user: PropTypes.object,
  ids: PropTypes.array,
  rooms: PropTypes.object,
  activeRoom: PropTypes.string
}

Drawer.defaultProps = {
  isLoadingUser: true,
  isLoadingRooms: true
}

function mapStateToProps(state) {
  return {
    isLoadingUser: state.viewer.isLoading,
    isLoadingRooms: state.rooms.isLoading,
    user: state.viewer.user,
    ids: state.rooms.ids,
    rooms: state.rooms.rooms,
    activeRoom: state.rooms.activeRoom
  }
}

export default connect(mapStateToProps)(Drawer)
