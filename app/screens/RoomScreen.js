import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  ListView,
  View
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/RoomStyles'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

import {getRoom} from '../modules/rooms'
import {getRoomMessages, prepareListView, getRoomMessagesBefore} from '../modules/messages'

import Loading from '../components/Loading'
import MessagesList from '../components/MessagesList'
import LoadginMoreSnack from '../components/LoadingMoreSnack'
import SendMessageField from '../components/SendMessageField'

class Room extends Component {
  constructor(props) {
    super(props)
    this.renderToolbar = this.renderToolbar.bind(this)
    this.renderListView = this.renderListView.bind(this)
    this.prepareDataSources = this.prepareDataSources.bind(this)
    this.onEndReached = this.onEndReached.bind(this)
  }

  componentDidMount() {
    // this.prepareDataSources()
    const {rooms, route, dispatch} = this.props
    if (!rooms[route.roomId]) {
      dispatch(getRoom(route.roomId))
    }
    dispatch(getRoomMessages(route.roomId))
  }

  // componentDidMount() {
  //   const {route, dispatch} = this.props
  //
  // }

  componentWillUnmount() {
    this.prepareDataSources()
  }

  onEndReached() {
    const {dispatch, route, hasNoMore, isLoadingMoreMessages, isLoadingMessages, listViewData} = this.props
    if (hasNoMore[route.roomId] !== true && isLoadingMoreMessages === false
        && isLoadingMessages === false && listViewData.data.length !== 0) {
      dispatch(getRoomMessagesBefore(route.roomId))
    }
  }


  prepareDataSources() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.props.dispatch(prepareListView(ds.cloneWithRows([])))
  }

  renderToolbar() {
    const {rooms, route} = this.props
    // const actions = [
    //   {title: 'Search', icon: require('image!ic_search_white_24dp'), show: 'always'}
    // ]
    const room = rooms[route.roomId]
    return (
      <View>
        {/* The view below is the crutch for padding top */}
        <View style={s.toolbarPadding} />
        <ToolbarAndroid
          navIcon={require('image!ic_menu_white_24dp')}
          onIconClicked={this.props.onMenuTap}
          title={room.name}
          titleColor="white"
          style={s.toolbar} />
      </View>
    )
  }

  renderSendMessageFiled() {
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
    const {listViewData, dispatch} = this.props
    return (
      <MessagesList
        listViewData={listViewData}
        dispatch={dispatch}
        onEndReached={this.onEndReached.bind(this)} />
    )
  }

  render() {
    const {rooms, route, isLoadingMessages, isLoadingMoreMessages} = this.props
    console.log("room!", rooms[route.roomId])
    if (!rooms[route.roomId]) {
      return <Loading color={colors.raspberry}/>
    }

    return (
      <View style={s.container}>
        {this.renderToolbar()}
        {isLoadingMoreMessages ? this.renderLoadingMore() : null}
        {isLoadingMessages ? <View style={{flex: 1}} /> : this.renderListView()}
        {this.renderSendMessageFiled()}
      </View>
    )
  }
}

Room.propTypes = {
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
    rooms: state.rooms.rooms,
    listViewData: state.messages.listView,
    isLoadingMessages: state.messages.isLoading,
    isLoadingMoreMessages: state.messages.isLoadingMore,
    byRoom: state.messages.byRoom,
    hasNoMore: state.messages.hasNoMore
  }
}

export default connect(mapStateToProps)(Room)
