import React, {
  Component,
  PropTypes,
  View,
  ListView
} from 'react-native'
import s from '../styles/screens/RoomUsers/RoomUsersScreenStyles'
import {connect} from 'react-redux'
import _ from 'lodash'

import * as Navigation from '../modules/navigation'
import {searchRoomUsers} from '../modules/search'
import {prepareListView, roomUsersWithSkip} from '../modules/users'

import CustomSearch from '../components/CustomSearch'
import RoomUsersSearchResult from '../components/RoomUsers/RoomUsersSearchResult'
import RoomUsersList from '../components/RoomUsers/RoomUsersList'

class RoomUsersScreen extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleBackPress = this.handleBackPress.bind(this)
    this.handleClearPress = this.handleClearPress.bind(this)
    this.renderSearch = this.renderSearch.bind(this)
    this.searchRequest = _.debounce(this.searchRequest.bind(this), 400)
    this.renderSearchResult = this.renderSearchResult.bind(this)
    this.prepareDataSources = this.prepareDataSources.bind(this)
    this.handleUserItemPress = this.handleUserItemPress.bind(this)
    this.onEndReached = this.onEndReached.bind(this)

    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    this.prepareDataSources()
  }

  onEndReached() {
    const {dispatch, route: {roomId}} = this.props
    dispatch(roomUsersWithSkip(roomId))
  }

  handleChange(event) {
    this.setState({value: event.nativeEvent.text})
    this.searchRequest(event.nativeEvent.text)
  }

  handleClearPress() {
    this.setState({value: ''})
  }

  handleBackPress() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  handleUserItemPress(id, username) {
    const {dispatch} = this.props
    dispatch(Navigation.goTo({name: 'user', userId: id, username}))
  }

  prepareDataSources() {
    const {listViewData, route: {roomId}, dispatch} = this.props
    if (!listViewData[roomId]) {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !_.isEqual(r1, r2)})
      dispatch(prepareListView(roomId, ds.cloneWithRows([])))
    }
  }

  searchRequest(query) {
    const {dispatch, route: {roomId}} = this.props

    if (!query.trim()) {
      return
    }

    dispatch(searchRoomUsers(roomId, query))
  }

  renderSearch() {
    return (
      <CustomSearch
        ref="customSearch"
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        onBackPress={this.handleBackPress.bind(this)}
        onClearPress={this.handleClearPress.bind(this)} />
    )
  }

  renderSearchResult() {
    const {roomUsersResult, isLoading} = this.props
    return (
      <RoomUsersSearchResult
        isLoading={isLoading}
        resultItems={roomUsersResult}
        onUserItemPress={this.handleUserItemPress.bind(this)} />
    )
  }

  renderUserList() {
    const {listViewData, route: {roomId}} = this.props
    return (
      <RoomUsersList
        listViewData={listViewData[roomId]}
        onEndReached={this.onEndReached.bind(this)}
        onUserItemPress={this.handleUserItemPress.bind(this)} />
    )
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderSearch()}
        <View style={s.bottomContainer}>
          {!!this.state.value ? this.renderSearchResult() : this.renderUserList()}
        </View>
      </View>
    )
  }
}

RoomUsersScreen.propTypes = {
  dispatch: PropTypes.func,
  roomUsersResult: PropTypes.array,
  route: PropTypes.object,
  isLoading: PropTypes.bool,
  listViewData: PropTypes.object
}

function mapStateToProps(state) {
  const {roomUsersResult, isLoadingRoomUser} = state.search
  return {
    roomUsersResult,
    isLoading: isLoadingRoomUser,
    listViewData: state.users.listView
  }
}

export default connect(mapStateToProps)(RoomUsersScreen)
