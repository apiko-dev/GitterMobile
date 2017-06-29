import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Linking, ScrollView, View, Platform} from 'react-native';
import {connect} from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import s from './styles'
import {getUser, chatPrivately} from '../../modules/users'

import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault
import navigationStyles from '../../styles/common/navigationStyles'

import Loading from '../../components/Loading'
import UserTop from './UserTop'
import UserInfo from './UserInfo'

class UserScreen extends Component {
  constructor(props) {
    super(props)

    this.renderTabs = this.renderTabs.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleGithubPress = this.handleGithubPress.bind(this)
    this.handleEmailPress = this.handleEmailPress.bind(this)
    this.handleChatPrivatelyPress = this.handleChatPrivatelyPress.bind(this)
    this.handleAvatarOnPress = this.handleAvatarOnPress.bind(this)

    this.state = {
      activeTab: 0
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    this.props.navigator.setTitle({title: 'User'})
    this.props.navigator.setButtons(
      Platform.OS === 'ios' ? {
        leftButtons: [{
          title: 'Close',
          id: 'close',
          iconColor: 'white',
          // icon: iconsMap.back,
          showAsAction: 'always'
        }]
      } : {}
    )
  }

  componentWillMount() {
    const {dispatch, username} = this.props
    dispatch(getUser(username))
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        })
      }
    }
  }

  handleTabChange({i}) {
    this.setState({
      activeTab: i
    })
  }

  handleGithubPress(url) {
    Linking.openURL(url)
  }

  handleEmailPress(email) {
    Linking.openURL(`mailto:${email}`)
  }

  handleChatPrivatelyPress(userId) {
    const {dispatch, navigator} = this.props
    dispatch(chatPrivately(userId, navigator))
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
          onChangeTab={this.handleTabChange}
          style={s.tabs}>
          <View tabLabel="INFO" style={s.container}>
            {this.renderUserInfoTab()}
          </View>
          <View tabLabel="REPOS" style={s.container} />
        </ScrollableTabView>
      </View>
    )
  }

  handleAvatarOnPress(avatar) {
    const {navigator, user} = this.props

    navigator.showModal({
      screen: 'gm.ImageLightbox',
      title: user.displayName || `@${user.username}`,
      passProps: { url: avatar },
      style: {
        backgroundBlur: 'dark',
        backgroundColor: '#ff000080'
      }
    })
  }

  render() {
    const {isLoadingUsers, user, currentUserId} = this.props
    if (isLoadingUsers || !user) {
      return (
        <View style={s.loadingContainer}>
          <Loading />
        </View>
      )
    }

    return (
      <View style={s.container}>
      <ScrollView>
          <UserTop {...user} onAvatarPress={this.handleAvatarOnPress} />
          <UserInfo {...user}
            onEmailPress={this.handleEmailPress.bind(this)}
            onGithubPress={this.handleGithubPress.bind(this)}
            onChatPrivatelyPress={this.handleChatPrivatelyPress.bind(this)}
            currentUserId={currentUserId} />
            </ScrollView>
        </View>
    )
  }
}

UserScreen.propTypes = {
  dispatch: PropTypes.func,
  isLoadingUsers: PropTypes.bool,
  users: PropTypes.object,
  route: PropTypes.object,
  currentUserId: PropTypes.string,
  user: PropTypes.object,
  navigator: PropTypes.object,
  username: PropTypes.string
}

UserScreen.navigatorStyle = {
  ...navigationStyles
}

function mapStateToProps(state, ownProps) {
  // const {current} = state.navigation
  const {isLoadingUsers} = state.users
  const {id} = state.viewer.user
  return {
    isLoadingUsers,
    currentUserId: id,
    user: state.users.entities[ownProps.userId],
    users: state.users.entities
  }
}

export default connect(mapStateToProps)(UserScreen)
