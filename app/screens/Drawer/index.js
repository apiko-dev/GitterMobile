import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Alert, View, Platform, ActionSheetIOS} from 'react-native';
import {connect} from 'react-redux'
import DialogAndroid from 'react-native-dialogs'

import {logOut} from '../../modules/auth'
import * as Navigation from '../../modules/navigation'
import {selectRoom, leaveRoom, markAllAsRead, refreshRooms} from '../../modules/rooms'
import {toggleDrawerSectionState} from '../../modules/ui'

import s from './styles'
import DrawerUserInfo from './DrawerUserInfo'
import ChannelList from './ChannelList'
import Loading from '../../components/Loading'

import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault
const iOS = Platform.OS === 'ios'

import {homeNavigator} from '../Home'

class Drawer extends Component {
  constructor(props) {
    super(props)
    this.onRoomPress = this.onRoomPress.bind(this)
    this.onLongRoomPress = this.onLongRoomPress.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.handleSettingsPress = this.handleSettingsPress.bind(this)
    this.handleDialogPress = this.handleDialogPress.bind(this)
    this.handleSearchPress = this.handleSearchPress.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleToggleCollapsed = this.handleToggleCollapsed.bind(this)
  }

  onRoomPress(id) {
    const {navigator} = this.props
    navigator.toggleDrawer({side: 'left', animated: true})
    // navigator.push({screen: 'gm.Room', passProps: {roomId: id}}) // doesn't work
    homeNavigator.push({screen: 'gm.Room', passProps: {roomId: id}}) // works
  }

  onLongRoomPress(id) {
    const {rooms} = this.props

    if (iOS) {
      const options = [
        'Mark as read',
        'Leave this room',
        'Close'
      ]
      ActionSheetIOS.showActionSheetWithOptions({
        title: rooms[id].name,
        options,
        cancelButtonIndex: 2
      }, index => this.handleDialogPress(index, options[index], id))
    } else {
      const dialog = new DialogAndroid()

      dialog.set({
        title: rooms[id].name,
        items: [
          'Mark as read',
          'Leave this room'
        ],
        itemsCallback: (index, text) => this.handleDialogPress(index, text, id)
      })
      dialog.show()
    }
  }

  onLeave(id) {
    const {dispatch} = this.props
    Alert.alert(
      'Leave room',
      'Are you sure?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Yes', onPress: () => dispatch(leaveRoom(id))}
      ]
    )
  }

  handleToggleCollapsed(sectionName, oldState) {
    const {dispatch} = this.props
    dispatch(toggleDrawerSectionState(sectionName, oldState))
  }

  handleSettingsPress() {
    const {navigator} = this.props
    navigator.toggleDrawer({side: 'left', animated: true})
    navigator.showModal(Object.assign({
      screen: 'gm.Settings',
      title: 'Settings',
      animationType: 'slide-up',
    }, iOS ? {navigatorButtons: {
      leftButtons: [{
        title: 'Close',
        id: 'close',
        iconColor: 'white',
        // icon: iconsMap.back,
        showAsAction: 'always'
      }]
    }} : {}))
  }

  handleSearchPress() {
    const {navigator} = this.props
    navigator.toggleDrawer({side: 'left', animated: true})
    homeNavigator.push({screen: 'gm.Search'}) // works
    // navigator.push({screen: 'gm.Search'}) // doesn't work
  }

  handleDialogPress(index, text, id) {
    const {dispatch} = this.props
    switch (text) {
    case 'Mark as read':
      dispatch(markAllAsRead(id))
      break
    case 'Leave this room':
      this.onLeave(id)
      break
    default:
      return null
    }
  }

  handleRefresh() {
    const {dispatch} = this.props
    dispatch(refreshRooms())
  }

  render() {
    const {user, ids, isLoadingRooms, sectionsState} = this.props

    return (
      <View style={s.container}>
        <DrawerUserInfo
          {...user}
          onSettingsPress={this.handleSettingsPress.bind(this)}
          onSearchPress={this.handleSearchPress} />
        {ids.length === 0
          ? <Loading color={colors.brand} />
          : <ChannelList
              {...this.props}
              onToggleCollapsed={this.handleToggleCollapsed}
              sectionsState={sectionsState}
              isLoadingRooms={isLoadingRooms}
              onRefresh={this.handleRefresh}
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
  navigator: PropTypes.object.isRequired,
  user: PropTypes.object,
  ids: PropTypes.array,
  rooms: PropTypes.object,
  activeRoom: PropTypes.string,
  sectionsState: PropTypes.object
}

Drawer.defaultProps = {
  isLoadingUser: true,
  isLoadingRooms: true
}

function mapStateToProps({viewer, rooms, ui}) {
  return {
    isLoadingUser: viewer.isLoading,
    isLoadingRooms: rooms.isLoading,
    user: viewer.user,
    ids: rooms.ids,
    rooms: rooms.rooms,
    activeRoom: rooms.activeRoom,
    sectionsState: ui.sectionsState
  }
}

export default connect(mapStateToProps)(Drawer)
