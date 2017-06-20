import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {View, ScrollView, Picker, Text, Platform} from 'react-native';
import {connect} from 'react-redux'
import s from './styles'

import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

import Button from '../../components/Button'

import {changeNotificationSettings} from '../../modules/rooms'

import Section from './Section'
import navigationStyles from '../../styles/common/navigationStyles'

class RoomSettings extends Component {
  constructor(props) {
    super(props)

    this.renderNotificationsSection = this.renderNotificationsSection.bind(this)
    this.handlePickerChange = this.handlePickerChange.bind(this)

    this.state = {
      pickerState: 0
    }

    this.props.navigator.setTitle({title: 'Room settings'})
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
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

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        })
      }
    }
  }

  handlePickerChange(value, index) {
    this.setState({
      pickerState: index
    })
  }

  handleSaveSettings() {
    const {pickerState} = this.state
    const {dispatch, roomId} = this.props

    dispatch(changeNotificationSettings(roomId, pickerState))

    setTimeout(() => {
      this.navigateBack()
    }, 500)
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
  roomId: PropTypes.string,
  settings: PropTypes.object
}

RoomSettings.navigatorStyle = {
  ...navigationStyles
}

function mapStateToProps({rooms}, {roomId}) {
  return {
    settings: rooms.notifications[roomId]
  }
}

export default connect(mapStateToProps)(RoomSettings)
