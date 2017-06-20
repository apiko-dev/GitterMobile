import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {ToastAndroid, TextInput, View, Platform} from 'react-native';
import {connect} from 'react-redux'
import _ from 'lodash'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {setInputValue, searchUsers, searchRooms, clearSearch} from '../../modules/search'
import s from './styles'
import {THEMES} from '../../constants'

import Toolbar from '../../components/Toolbar'

import SearchUsersTab from './SearchUsersTab'
import SearchRoomsTab from './SearchRoomsTab'

const {colors} = THEMES.gitterDefault
import navigationStyles from '../../styles/common/navigationStyles'
const iOS = Platform.OS === 'ios'

class SearchScreen extends Component {
  constructor(props) {
    super(props)

    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.handleActionPress = this.handleActionPress.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.searchRequest = _.debounce(this.searchRequest.bind(this), 250)
    this.renderUsersTab = this.renderUsersTab.bind(this)
    this.handleRoomItemPress = this.handleRoomItemPress.bind(this)
    this.handleUserItemPress = this.handleUserItemPress.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)

    this.state = {
      value: '',
      activeTab: 0
    }
  }

  componentDidMount() {
    // dirty hack to get text input focus on mounting
    // it won't focus because of tab-view without delay
    // for some reasons
    setTimeout(() => this.refs.textInput.focus(), 500)
  }

  navigateBack() {
    const {dispatch, navigator} = this.props
    // dispatch(Navigation.goBack())
    navigator.pop()
    dispatch(clearSearch())
  }

  handleActionPress(index) {
    const {dispatch} = this.props
    if (index === 0) {
      this.setState({value: ''})
      dispatch(clearSearch())
    }
  }

  handleInputChange(event) {
    const {text} = event.nativeEvent
    this.setState({value: text})
    this.searchRequest(text)
  }

  handleRoomItemPress(id, exists) {
    if (!exists) {
      // TODO: Navigate to 'create room' screen instead
      ToastAndroid.show('Room not exist yet', ToastAndroid.SHORT)
      return
    }
    const {navigator} = this.props
    navigator.push({screen: 'gm.Room', passProps: {roomId: id}})
  }

  handleUserItemPress(id, username) {
    if (!id) {
      ToastAndroid.show("User don't have gitter profile", ToastAndroid.SHORT)
      return
    }
    const {navigator} = this.props
    navigator.showModal({screen: 'gm.User', passProps: {userId: id, username}})
  }

  handleTabChange({i}) {
    this.setState({activeTab: i})
    const {value} = this.state
    if (!!value) {
      this.searchRequest(value)
    } else {
      // dirty hack again
      setTimeout(() => this.refs.textInput.focus(), 500)
    }
  }

  searchRequest(text) {
    const {dispatch} = this.props
    const {activeTab} = this.state

    dispatch(setInputValue(text))

    if (!text.trim()) {
      return
    }

    if (activeTab === 0) {
      dispatch(searchRooms(text))
    } else {
      dispatch(searchUsers(text))
    }
  }

  renderToolbar() {
    const {value} = this.state
    const actions = !!value
      ? [{title: 'Clear', iconName: 'close', iconColor: 'white', show: 'always'}]
      : []

    return (
      <Toolbar
        navIconName={iOS ? 'chevron-left' : 'arrow-back'}
        iconColor="white"
        onIconClicked={this.navigateBack}
        actions={actions}
        onActionSelected={this.handleActionPress}
        style={s.toolbar}>
        <View style={s.toolbarContainer}>
          <TextInput
            ref="textInput"
            style={s.textInput}
            value={value}
            keyboardShouldPersistTaps={false}
            underlineColorAndroid={colors.raspberry}
            placeholderTextColor={colors.androidGray}
            onChange={this.handleInputChange}
            placeholder="Type your search query..." />
        </View>
      </Toolbar>
    )
  }

  renderTabs() {
    return (
      <View style={s.tabsContainer}>
        <ScrollableTabView
          initialPage={this.state.activeTab}
          tabBarBackgroundColor={colors.raspberry}
          tabBarUnderlineStyle={{backgroundColor: 'white'}}
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor={colors.androidGray}
          onChangeTab={this.handleTabChange}
          style={s.tabs}>
          <View tabLabel="Rooms" style={s.container}>
            {this.renderRoomsTab()}
          </View>
          <View tabLabel="Users" style={s.container}>
            {this.renderUsersTab()}
          </View>
        </ScrollableTabView>
    </View>
    )
  }

  renderUsersTab() {
    const {isLoadingUsers, usersResult} = this.props
    const {value} = this.state
    return (
      <SearchUsersTab
        isLoadingUsers={isLoadingUsers}
        usersResult={usersResult}
        value={value}
        onPress={this.handleUserItemPress.bind(this)} />
    )
  }

  renderRoomsTab() {
    const {isLoadingRooms, roomsResult} = this.props
    const {value} = this.state
    return (
      <SearchRoomsTab
        isLoadingRooms={isLoadingRooms}
        roomsResult={roomsResult}
        value={value}
        onPress={this.handleRoomItemPress.bind(this)} />
    )
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderToolbar()}
        {this.renderTabs()}
      </View>
    )
  }
}

SearchScreen.navigatorStyle = {
  ...navigationStyles,
  navBarHidden: true
}

SearchScreen.propTypes = {
  dispatch: PropTypes.func,
  isLoadingUsers: PropTypes.bool,
  isLoadingRooms: PropTypes.bool,
  inputValue: PropTypes.string,
  usersResult: PropTypes.array,
  roomsResult: PropTypes.array
}

function mapStateToProps(state) {
  const {
    isLoadingUsers,
    isLoadingRooms,
    inputValue,
    usersResult,
    roomsResult
  } = state.search
  return {
    isLoadingUsers,
    isLoadingRooms,
    inputValue,
    usersResult,
    roomsResult
  }
}

export default connect(mapStateToProps)(SearchScreen)
