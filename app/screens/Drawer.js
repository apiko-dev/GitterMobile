import React, {
  Component,
  PropTypes,
  Alert,
  View
} from 'react-native'
import {connect} from 'react-redux'
import {logOut} from '../modules/auth'
import * as Navigation from '../modules/navigation'
import {selectRoom, leaveRoom, markAllAsRead} from '../modules/rooms'
import s from '../styles/screens/Drawer/DrawerStyles'
import DrawerUserInfo from '../components/Drawer/DrawerUserInfo'
import ChannelList from '../components/Drawer/ChannelList'
import Loading from '../components/Loading'

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

class Drawer extends Component {
  constructor(props) {
    super(props)
    this.onRoomPress = this.onRoomPress.bind(this)
    this.onLongRoomPress = this.onLongRoomPress.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  onRoomPress(id) {
    const {dispatch, navigateTo} = this.props
    navigateTo({name: 'room', roomId: id})
    dispatch(selectRoom(id))
  }

  onLongRoomPress(id) {
    const {rooms, dispatch} = this.props
    Alert.alert(
      rooms[id].name,
      'What do you want to do?',
      [
        {text: 'Mark as read', onPress: () => dispatch(markAllAsRead(id))},
        {text: 'Leave room', onPress: () => this.onLeave(id)},
        {text: 'Close', onPress: () => console.log('Cancel Pressed!')}
      ]
    )
  }

  onLeave(id) {
    const {dispatch} = this.props
    Alert.alert(
      'Leave room',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => dispatch(leaveRoom(id))}
      ]
    )
  }

  onLogOut() {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => this.logOut()}
      ]
    )
  }

  logOut() {
    const {dispatch} = this.props
    dispatch(logOut())
  }

  render() {
    const {user, ids} = this.props

    return (
      <View style={s.container}>
        <DrawerUserInfo {...user} onLogOut={this.onLogOut.bind(this)}/>
        {ids.length === 0
          ? <Loading color={colors.brand} />
          : <ChannelList
              {...this.props}
              onLongRoomPress={this.onLongRoomPress.bind(this)}
              onRoomPress={this.onRoomPress.bind(this)} />
        }
      </View>
    )
  }
}

Drawer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoadingUser: PropTypes.bool,
  isLoadingRooms: PropTypes.bool,
  navigateTo: PropTypes.func.isRequired,
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
