import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  TextInput,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import _ from 'lodash'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Navigation from '../modules/navigation'
import {setInputValue, searchUsers, searchRooms, clearSearch} from '../modules/search'
import s from '../styles/SearchScreenStyles.js'
import {THEMES} from '../constants'
import SearchUsersTab from '../components/SearchUsersTab'
import SearchRoomsTab from '../components/SearchRoomsTab'

const {colors} = THEMES.gitterDefault

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
    this.handleItemPress = this.handleItemPress.bind(this)

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
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
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

  handleItemPress(id) {
    const {dispatch} = this.props
    dispatch(Navigation.goTo({name: 'room', roomId: id}))
  }

  searchRequest(text) {
    const {dispatch} = this.props
    const {activeTab} = this.state

    dispatch(setInputValue(text))

    if (!text.trim()) {
      return
    }

    if (activeTab === 0) {
      dispatch(searchUsers(text))
    } else {
      dispatch(searchRooms(text))
    }
  }

  renderToolbar() {
    const {value} = this.state
    const actions = !!value
      ? [{title: 'Clear', icon: require('image!ic_close_white_24dp'), show: 'always'}]
      : []

    return (
      <ToolbarAndroid
        navIcon={require('image!ic_arrow_back_white_24dp')}
        onIconClicked={this.navigateBack}
        actions={actions}
        onActionSelected={this.handleActionPress}
        style={s.toolbar}>
        <View style={s.toolbarContainer}>
          <TextInput
            ref="textInput"
            style={s.textInput}
            value={value}
            onSubmitEditing={() => this.searchRequest(this.state.value)}
            underlineColorAndroid={colors.raspberry}
            placeholderTextColor="white"
            onChange={this.handleInputChange}
            placeholder="Search" />
        </View>
      </ToolbarAndroid>
    )
  }

  renderTabs() {
    return (
      <View style={s.tabsContainer}>
        <ScrollableTabView
          initialPage={this.state.activeTab}
          tabBarBackgroundColor={colors.raspberry}
          tabBarUnderlineColor="white"
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor={colors.androidGray}
          onChangeTab={index => this.setState({activeTab: index})}
          style={s.tabs}>
          <View tabLabel="Users" style={s.container}>
            {this.renderUsersTab()}
          </View>
          <View tabLabel="Rooms" style={s.container}>
            {this.renderRoomsTab()}
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
        onPress={this.handleItemPress.bind(this)} />
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
        onPress={this.handleItemPress.bind(this)} />
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
