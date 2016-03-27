import React, {
  Component,
  PropTypes,
  View
} from 'react-native'
import s from '../styles/screens/RoomUserAdd/RoomUserAddScreenStyles'
import {connect} from 'react-redux'
import _ from 'lodash'

import * as Navigation from '../modules/navigation'
import {searchUsers, clearSearch} from '../modules/search'
import {addUserToRoom} from '../modules/rooms'

import CustomSearch from '../components/CustomSearch'
import SearchResult from '../components/RoomUserAdd/SearchResult'

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

  componentDidMount() {
    this.refs.customSearch.focus()
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
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  handleUserItemPress(id, username) {
    const {dispatch} = this.props
    dispatch(Navigation.goTo({name: 'user', userId: id, username}))
  }

  handleAddPress(username) {
    const {dispatch, route: {roomId}} = this.props
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
        ref="customSearch"
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
  route: PropTypes.object,
  isLoading: PropTypes.bool
}

function mapStateToProps(state) {
  const {usersResult, isLoadingUsers} = state.search
  return {
    usersResult,
    isLoading: isLoadingUsers
  }
}

export default connect(mapStateToProps)(RoomUserAddScreen)
