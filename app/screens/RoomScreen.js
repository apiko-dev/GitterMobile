import React, {
  Component,
  PropTypes,
  InteractionManager,
  ToolbarAndroid,
  StatusBar,
  ListView,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/RoomStyles'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

import {getRoom, selectRoom} from '../modules/rooms'
import {getRoomMessages, prepareListView,
  getRoomMessagesBefore, getRoomMessagesIfNeeded,
  subscribeToChatMessages} from '../modules/messages'

import Loading from '../components/Loading'
import MessagesList from '../components/MessagesList'
import LoadginMoreSnack from '../components/LoadingMoreSnack'
import SendMessageField from '../components/SendMessageField'
import JoinRoomField from '../components/JoinRoomField'

class Room extends Component {
  constructor(props) {
    super(props)
    this.renderToolbar = this.renderToolbar.bind(this)
    this.renderListView = this.renderListView.bind(this)
    this.prepareDataSources = this.prepareDataSources.bind(this)
    this.onEndReached = this.onEndReached.bind(this)
  }

  componentDidMount() {
    this.prepareDataSources()
    const {activeRoom, rooms, route: { roomId }, dispatch, listViewData} = this.props
    // dispatch(subscribeToChatMessages(roomId))

    InteractionManager.runAfterInteractions(() => {
      if (activeRoom !== roomId) {
        dispatch(selectRoom(roomId))
      }
      if (!rooms[roomId]) {
        dispatch(getRoom(roomId))
      }
      if (!listViewData[roomId]) {
        dispatch(getRoomMessages(roomId))
      } else {
        dispatch(getRoomMessagesIfNeeded(roomId))
      }
    })
  }

  onEndReached() {
    const {dispatch, route: {roomId}, hasNoMore, isLoadingMoreMessages, isLoadingMessages, listViewData} = this.props
    if (hasNoMore[roomId] !== true && isLoadingMoreMessages === false
        && isLoadingMessages === false && listViewData[roomId].data.length !== 0) {
      dispatch(getRoomMessagesBefore(roomId))
    }
  }


  prepareDataSources() {
    const {listViewData, route: {roomId}, dispatch} = this.props
    if (!listViewData[roomId]) {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      dispatch(prepareListView(roomId, ds.cloneWithRows([])))
    }
  }

  renderToolbar() {
    const {rooms, route} = this.props
    // const actions = [
    //   {title: 'Search', icon: require('image!ic_search_white_24dp'), show: 'always'}
    // ]
    const room = rooms[route.roomId]
    return (
      <ToolbarAndroid
        navIcon={require('image!ic_menu_white_24dp')}
        onIconClicked={this.props.onMenuTap}
        title={room.name}
        titleColor="white"
        style={s.toolbar} />
    )
  }

  renderSendMessageFiled() {
    const {rooms, route: {roomId}} = this.props
    if (!rooms[roomId].roomMember) {
      return (
        <JoinRoomField />
      )
    }
    return (
      <SendMessageField />
    )
  }

  renderLoadingMore() {
    return (
      <LoadginMoreSnack />
    )
  }

  renderListView() {
    const {listViewData, dispatch, route: {roomId}} = this.props
    return (
      <MessagesList
        listViewData={listViewData[roomId]}
        dispatch={dispatch}
        onEndReached={this.onEndReached.bind(this)} />
    )
  }

  render() {
    const {rooms, route, isLoadingMessages, isLoadingMoreMessages} = this.props
    if (!rooms[route.roomId]) {
      return <Loading color={colors.raspberry}/>
    }

    return (
      <View style={s.container}>
        <StatusBar
          backgroundColor={colors.darkRed} />
        {this.renderToolbar()}
        {isLoadingMoreMessages ? this.renderLoadingMore() : null}
        {isLoadingMessages ? <View style={{flex: 1}} /> : this.renderListView()}
        {this.renderSendMessageFiled()}
      </View>
    )
  }
}

Room.propTypes = {
  activeRoom: PropTypes.string,
  rooms: PropTypes.object,
  onMenuTap: PropTypes.func,
  route: PropTypes.object,
  dispatch: PropTypes.func,
  isLoadingMessages: PropTypes.bool,
  isLoadingMoreMessages: PropTypes.bool,
  listViewData: PropTypes.object,
  byRoom: PropTypes.object,
  hasNoMore: PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeRoom: state.rooms.activeRoom,
    rooms: state.rooms.rooms,
    listViewData: state.messages.listView,
    isLoadingMessages: state.messages.isLoading,
    isLoadingMoreMessages: state.messages.isLoadingMore,
    byRoom: state.messages.byRoom,
    hasNoMore: state.messages.hasNoMore
  }
}

export default connect(mapStateToProps)(Room)
