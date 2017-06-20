import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {View} from 'react-native';
import s from './styles'
import {connect} from 'react-redux'
import _ from 'lodash'

import navigationStyles from '../../styles/common/navigationStyles'
import {searchUsers, clearSearch} from '../../modules/search'
import {addUserToRoom} from '../../modules/rooms'

import CustomSearch from '../../components/CustomSearch'
import SearchResult from './SearchResult'

class RoomUserAddScreen extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleBackPress = this.handleBackPress.bind(this)
    this.handleClearPress = this.handleClearPress.bind(this)
    this.renderSearch = this.renderSearch.bind(this)
    this.searchRequest = _.debounce(this.searchRequest.bind(this), 400)
    this.renderSearchResult = this.renderSearchResult.bind(this)
    this.handleUserItemPress = this.handleUserItemPress.bind(this)
    this.handleAddPress = this.handleAddPress.bind(this)

    this.state = {
      value: ''
    }
  }

  componentMillMount() {
    const {dispatch} = this.props
    dispatch(clearSearch())
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

  handleAddPress(username) {
    const {dispatch, roomId} = this.props
    dispatch(addUserToRoom(roomId, username))
  }

  searchRequest(query) {
    const {dispatch} = this.props

    if (!query.trim()) {
      return
    }

    dispatch(searchUsers(query))
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
    const {usersResult, isLoading} = this.props
    return (
      <SearchResult
        isLoading={isLoading}
        resultItems={usersResult}
        onUserItemPress={this.handleUserItemPress.bind(this)}
        onAddPress={this.handleAddPress.bind(this)} />
    )
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderSearch()}
        <View style={s.bottomContainer}>
          {this.renderSearchResult()}
        </View>
      </View>
    )
  }
}

RoomUserAddScreen.propTypes = {
  dispatch: PropTypes.func,
  usersResult: PropTypes.array,
  roomId: PropTypes.string,
  isLoading: PropTypes.bool,
  navigator: PropTypes.object
}

RoomUserAddScreen.navigatorStyle = {
  ...navigationStyles,
  navBarHidden: true
}

function mapStateToProps(state) {
  const {usersResult, isLoadingUsers} = state.search
  return {
    usersResult,
    isLoading: isLoadingUsers
  }
}

export default connect(mapStateToProps)(RoomUserAddScreen)
