import React, {Component, PropTypes} from 'react';
import {ScrollView, View, Alert} from 'react-native';
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
