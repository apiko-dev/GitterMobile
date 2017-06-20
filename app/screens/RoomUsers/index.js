import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {View, ListView} from 'react-native';
import s from './styles'
import {connect} from 'react-redux'
import _ from 'lodash'
import navigationStyles from '../../styles/common/navigationStyles'

import {searchRoomUsers} from '../../modules/search'
import {prepareListView, roomUsersWithSkip} from '../../modules/users'

import CustomSearch from '../../components/CustomSearch'
import RoomUsersSearchResult from './RoomUsersSearchResult'
import RoomUsersList from './RoomUsersList'

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
    const {dispatch, roomId} = this.props
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
    const {navigator} = this.props
    navigator.dismissModal()
  }

  handleUserItemPress(id, username) {
    const {navigator} = this.props
    navigator.showModal({screen: 'gm.User', passProps: {userId: id, username}})
  }

  prepareDataSources() {
    const {listViewData, roomId, dispatch} = this.props
    if (!listViewData[roomId]) {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !_.isEqual(r1, r2)})
      dispatch(prepareListView(roomId, ds.cloneWithRows([])))
    }
  }

  searchRequest(query) {
    const {dispatch, roomId} = this.props

    if (!query.trim()) {
      return
    }

    dispatch(searchRoomUsers(roomId, query))
  }

  renderSearch() {
    return (
      <CustomSearch
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
    const {listViewData, roomId} = this.props
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
  roomId: PropTypes.string,
  isLoading: PropTypes.bool,
  listViewData: PropTypes.object,
  navigator: PropTypes.object
}

RoomUsersScreen.navigatorStyle = {
  ...navigationStyles,
  navBarHidden: true
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
