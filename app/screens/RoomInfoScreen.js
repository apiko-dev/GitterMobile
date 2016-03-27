import React, {
  PropTypes,
  Component,
  ScrollView,
  Linking,
  View
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/screens/RoomInfo/RoomInfoScreenStyles'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault
import _ from 'lodash'

import * as Navigation from '../modules/navigation'
import {clearRoomInfoError, getRoomInfo} from '../modules/roomInfo'
import {roomUsers} from '../modules/users'

import Loading from '../components/Loading'
import FailedToLoad from '../components/FailedToLoad'
import RoomInfo from '../components/RoomInfo/RoomInfo'
import RepoInfo from '../components/RoomInfo/RepoInfo'
import UserInfo from '../components/RoomInfo/UserInfo'
import RoomUsers from '../components/RoomInfo/RoomUsers'


class RoomInfoScreen extends Component {
  constructor(props) {
    super(props)
    this.renderInfo = this.renderInfo.bind(this)
    this.renderUsers = this.renderUsers.bind(this)
    this.refetchData = this.refetchData.bind(this)
    this.handleUserPress = this.handleUserPress.bind(this)
    this.handleUrlPress = this.handleUrlPress.bind(this)
    this.handleStatItemPress = this.handleStatItemPress.bind(this)
    this.handleAddPress = this.handleAddPress.bind(this)
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(clearRoomInfoError())
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props, nextProps)) {
      return
    }

    const {rooms, roomInfo, route: {roomId}, dispatch, roomInfoDrawerState, users} = nextProps
    const room = rooms[roomId]
    if (!!room && roomInfoDrawerState === 'open' && !roomInfo[room.name]) {
      dispatch(getRoomInfo(room.name, roomId))
    }
    if (!!room && roomInfoDrawerState === 'open' && !users[roomId]) {
      dispatch(roomUsers(roomId))
    }
  }

  handleUserPress(userId, username) {
    const {dispatch} = this.props
    dispatch(Navigation.goTo({name: 'user', userId, username}))
  }

  handleUrlPress(url) {
    Linking.openURL(url)
  }

  handleStatItemPress(url, type) {
    Linking.openURL(`${url}/${type}`)
  }

  handleAddPress() {
    const {dispatch, route: {roomId}} = this.props
    dispatch(Navigation.goTo({name: 'addUser', roomId}))
  }

  handleAllUsersPress() {
    const {dispatch, route: {roomId}} = this.props
    dispatch(Navigation.goTo({name: 'roomUsers', roomId}))
  }

  refetchData() {
    const {rooms, route: {roomId}, dispatch} = this.props
    const room = rooms[roomId]
    dispatch(clearRoomInfoError())
    dispatch(getRoomInfo(room.name, roomId))
  }

  renderInfo() {
    const {rooms, roomInfo, route: {roomId}} = this.props

    if (rooms[roomId].githubType === 'REPO') {
      return (
        <RepoInfo
          onStatItemPress={this.handleStatItemPress.bind(this)}
          handleUrlPress={this.handleUrlPress.bind(this)}
          {...roomInfo[rooms[roomId].name]} />
      )
    }

    if (rooms[roomId].githubType === 'ONETOONE') {
      return (
        <UserInfo
          {...roomInfo[rooms[roomId].name]} />
      )
    }
    return (
      <RoomInfo
        {...roomInfo[rooms[roomId].name]} />
    )
  }

  renderUsers() {
    const {users, rooms, route: {roomId}} = this.props
    return (
      <RoomUsers
        oneToOne={rooms[roomId].githubType === 'ONETOONE' ? true : false}
        userCount={rooms[roomId].userCount}
        ids={users[roomId].ids}
        entities={users[roomId].entities}
        onPress={this.handleUserPress.bind(this)}
        onAllUsersPress={this.handleAllUsersPress.bind(this)}
        onAddPress={this.handleAddPress.bind(this)} />
    )
  }


  render() {
    const {users, rooms, roomInfo, route: {roomId}, isError} = this.props
    const room = rooms[roomId]
    if (isError) {
      return (
        <View style={s.container}>
          <FailedToLoad
            message="Failed to load room info."
            onRetry={this.refetchData.bind(this)} />
        </View>
      )
    }

    if (!room || !roomInfo[room.name] || !users[roomId]) {
      return (
        <View style={s.container}>
          <Loading />
        </View>
      )
    }

    return (
      <View style={s.container}>
        <ScrollView>
          {this.renderInfo()}
          {this.renderUsers()}
        </ScrollView>
      </View>
    )
  }
}

RoomInfoScreen.propTypes = {
  dispatch: PropTypes.func,
  drawer: PropTypes.element,
  route: PropTypes.object,
  roomInfo: PropTypes.object,
  rooms: PropTypes.object,
  roomInfoDrawerState: PropTypes.string,
  isError: PropTypes.bool,
  users: PropTypes.object
}

function mapStateToProps(state) {
  return {
    roomInfo: state.roomInfo.entities,
    rooms: state.rooms.rooms,
    roomInfoDrawerState: state.ui.roomInfoDrawerState,
    isError: state.roomInfo.isError,
    users: state.users.byRoom
  }
}

export default connect(mapStateToProps)(RoomInfoScreen)
