import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  ScrollView,
  View,
  Switch,
  TextInput
} from 'react-native'
import {connect} from 'react-redux'

import s from '../styles/screens/Settings'
import * as Navigation from '../modules/navigation'
import {readAll} from '../modules/settings'

import Heading from '../components/Heading'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.renderSettings = this.renderSettings.bind(this)
    this.handleSwitchChange = this.changeSwitch.bind(this)
    this.handleCountChange = this.handleCountChange.bind(this)

    this.state = {
    }
  }

  handleSwitchChange(value) {
    const {dispatch, readAllMessages: {limit}} = this.props
    dispatch(readAll(value, limit))
  }

  handleCountChange(count) {
    const {dispatch, readAllMessages: {enabled}} = this.props
    dispatch(readAll(enabled, count))
  }

  navigateBack() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  renderToolbar() {
    const {route} = this.props
    return (
      <ToolbarAndroid
        navIcon={require('image!ic_arrow_back_white_24dp')}
        onIconClicked={this.navigateBack}
        title="Settings"
        titleColor="white"
        style={s.toolbar} />
    )
  }

  renderSettings() {
    const {readAllMessages: {enabled, limit}} = this.props
    return (
      <View style={s.itemWrap}>
        <Heading
          text="Read all messages" />
        <View style={s.readAllwrap}>
          <Text>Read all messages once navigate to room and it's count is {limit}</Text>
          <Switch
            value={enabled}
            onValueChange={this.handleSwitchChange} />
        </View>
        {enabled && (
          <TextInput
            defaultValue={limit}
            onChangeText={this.handleCountChange} />
        )}
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
