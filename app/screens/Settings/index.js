import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Platform, View, Alert} from 'react-native';
import {connect} from 'react-redux'

import s from './styles'
import {logOut} from '../../modules/auth'
import navigationStyles from '../../styles/common/navigationStyles'

import Group from './Group'
import TextItem from './TextItem'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.renderSettings = this.renderSettings.bind(this)
    this.handleLogout = this.handleLogout.bind(this)

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    this.props.navigator.setButtons(
      Object.assign(
        Platform.OS === 'ios' ? {navigatorButtons: {
          leftButtons: [{
            title: 'Close',
            id: 'close',
            iconColor: 'white',
            // icon: iconsMap.back,
            showAsAction: 'always'
          }]
        }} : {}
      )
    )
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

  onLogOut() {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Yes', onPress: () => this.handleLogout()}
      ]
    )
  }

  handleLogout() {
    const {dispatch} = this.props
    dispatch(logOut())
  }

  renderSettings() {
    return (
      <View style={s.container}>

          <Group
            heading="General">
            <TextItem
              text="LOGOUT"
              onPress={() => this.onLogOut()} />
          </Group>

      </View>
    )
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderSettings()}
      </View>
    )
  }
}

Settings.propTypes = {
  dispatch: PropTypes.func,
  readAllMessages: PropTypes.object
}

Settings.navigatorStyle = {
  ...navigationStyles
}


function mapStateToProps(state) {
  const {readAllMessages} = state.settings
  return {
    readAllMessages
  }
}

export default connect(mapStateToProps)(Settings)
