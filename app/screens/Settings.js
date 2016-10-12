import React, {Component, PropTypes} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import {connect} from 'react-redux'

import s from '../styles/screens/Settings'
import * as Navigation from '../modules/navigation'
import {logOut} from '../modules/auth'

import Toolbar from '../components/Toolbar'
import Group from '../components/Settings/Group'
import TextItem from '../components/Settings/TextItem'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.renderSettings = this.renderSettings.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
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

  navigateBack() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  renderToolbar() {
    return (
      <Toolbar
        navIcon={require('image!ic_arrow_back_white_24dp')}
        onIconClicked={this.navigateBack}
        title="Settings"
        titleColor="white"
        style={s.toolbar} />
    )
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
        {this.renderToolbar()}
        {this.renderSettings()}

      </View>
    )
  }
}

Settings.propTypes = {
  dispatch: PropTypes.func,
  readAllMessages: PropTypes.object
}


function mapStateToProps(state) {
  const {readAllMessages} = state.settings
  return {
    readAllMessages
  }
}

export default connect(mapStateToProps)(Settings)
