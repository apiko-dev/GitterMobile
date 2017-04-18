import React, {Component, PropTypes} from 'react';
import {View, ScrollView, Picker, Text} from 'react-native';
import {connect} from 'react-redux'
import s from './styles'

import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

import Toolbar from '../../components/Toolbar'
import Button from '../../components/Button'

import {changeNotificationSettings} from '../../modules/rooms'
import * as Navigation from '../../modules/navigation'

import Section from './Section'

class RoomSettings extends Component {
  constructor(props) {
    super(props)

    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.renderNotificationsSection = this.renderNotificationsSection.bind(this)
    this.handlePickerChange = this.handlePickerChange.bind(this)

    this.state = {
      pickerState: 0
    }
  }

  componentWillMount() {
    const {settings} = this.props
    let pickerState
    if (settings.mode === 'all') {
      pickerState = 0
    } else if (settings.mode === 'announcement') {
      pickerState = 1
    } else {
      pickerState = 2
    }
    this.setState({pickerState})
  }

  componentWillUnmount() {

  }

  handlePickerChange(value, index) {
    this.setState({
      pickerState: index
    })
  }

  handleSaveSettings() {
    const {pickerState} = this.state
    const {dispatch, route: {roomId}} = this.props

    dispatch(changeNotificationSettings(roomId, pickerState))

    setTimeout(() => {
      this.navigateBack()
    }, 500)
  }

  navigateBack() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  renderToolbar() {
    return (
      <Toolbar
        navIconName="arrow-back"
        iconColor="white"
        onIconClicked={this.navigateBack}
        title="Message"
        titleColor="white"
        style={s.toolbar} />
    )
  }

  renderNotificationsSection() {
    const {pickerState} = this.state

    const items = [
      'All: Notify me for all messages',
      'Announcements: Notify for mentions and announcements',
      "Mute: Notify me only when I'm directly mentioned"
    ]

    return (
      <Section
        title="Notifications">
        <Picker
          style={s.picker}
          itemStyle={s.itemStyle}
          selectedValue={pickerState}
          onValueChange={this.handlePickerChange}>
          {items.map((item, index) => (
            <Picker.Item label={item} value={index} />
          ))}
        </Picker>
      </Section>
    )
  }

  renderSaveButton() {
    return (
      <Button
        rippleColor={colors.raspberry}
        style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}
        onPress={() => this.handleSaveSettings()}>
        <Text pointerEvents="none"
          style={s.buttonText}>
          Save changes
        </Text>
      </Button>

    )
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderToolbar()}
        <ScrollView>
          {this.renderNotificationsSection()}
          {this.renderSaveButton()}
        </ScrollView>
      </View>
    )
  }
}

RoomSettings.propTypes = {
  dispatch: PropTypes.func,
  route: PropTypes.object,
  settings: PropTypes.object
}

function mapStateToProps({rooms}, {route: {roomId}}) {
  return {
    settings: rooms.notifications[roomId]
  }
}

export default connect(mapStateToProps)(RoomSettings)
