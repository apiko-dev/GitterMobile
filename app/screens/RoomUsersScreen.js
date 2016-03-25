import React, {
  Component,
  PropTypes,
  View
} from 'react-native'
import s from '../styles/screens/RoomUsers/RoomUsersScreenStyles'
import {connect} from 'react-redux'
import _ from 'lodash'

import * as Navigation from '../modules/navigation'
import {searchRoomUsers} from '../modules/search'

import CustomSearch from '../components/CustomSearch'
import RoomUsersSearchResult from '../components/RoomUsers/RoomUsersSearchResult'

class RoomUsersScreen extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleBackPress = this.handleBackPress.bind(this)
    this.handleClearPress = this.handleClearPress.bind(this)
    this.renderSearch = this.renderSearch.bind(this)
    this.searchRequest = _.debounce(this.searchRequest.bind(this), 250)
    this.renderSearchResult = this.renderSearchResult.bind(this)

    this.state = {
      value: ''
    }
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
      <View style={s.bottomContainer}>
        <RoomUsersSearchResult
          isLoading={isLoading}
          resultItems={roomUsersResult} />
      </View>
    )
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderSearch()}
        {!!this.state.value && this.renderSearchResult()}
      </View>
    )
  }
}

RoomUsersScreen.propTypes = {
  dispatch: PropTypes.func,
  roomUsersResult: PropTypes.array,
  route: PropTypes.object,
  isLoading: PropTypes.bool
}

function mapStateToProps(state) {
  const {roomUsersResult, isLoadingRoomUser} = state.search
  return {
    roomUsersResult,
    isLoading: isLoadingRoomUser
  }
}

export default connect(mapStateToProps)(RoomUsersScreen)
