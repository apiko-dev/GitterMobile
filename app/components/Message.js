import React, {
  Component,
  PropTypes,
  TouchableNativeFeedback,
  Alert,
  View,
  Text
} from 'react-native'
import s from '../styles/MessageStyles'
import _ from 'lodash'
import moment from 'moment'

import Avatar from './Avatar'

class Message extends Component {
  constructor(props) {
    super(props)

    this.onMessagePress = this.onMessagePress.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.renderDate = this.renderDate.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      return true
    } else {
      return false
    }
  }

  onMessagePress() {
    const {onResendingMessage, text, rowId} = this.props
    if (!!this.props.failed && this.props.failed === true) {
      onResendingMessage(rowId, text)
    }
  }

  onLongPress() {
    const {id, rowId, onLongPress} = this.props
    onLongPress(rowId, id)
  }

  renderDate() {
    const {sent} = this.props
    if (!Date.parse(sent)) {
      return sent
    } else {
      return moment(sent).format('HH:mm')
    }
  }

  renderMessage() {
    const {text} = this.props

    if (this.props.hasOwnProperty('editedAt') && !text) {
      return (
        <Text style={[s.text, s.deleted]}>
          This message was deleted
        </Text>
      )
    }
    return (
      <Text style={s.text}>
        {text}
      </Text>
    )
  }

  render() {
    const {fromUser, sending, failed} = this.props
    const opacity = sending === true ? 0.4 : 1
    const backgroundColor = failed === true ? 'rgba(255, 0, 0, 0.2)' : 'transparent'


    return (
      <TouchableNativeFeedback
        onPress={() => this.onMessagePress()}
        onLongPress={() => this.onLongPress()}>
        <View style={[s.container, {opacity, backgroundColor}]}>
          <Avatar src={fromUser.avatarUrlSmall} size={30} />
          <View style={s.content}>
            <View style={s.top}>
              <Text style={s.username}>{fromUser.username}</Text>
              <Text style={s.date}>{this.renderDate()}</Text>
            </View>
            <View style={s.bottom}>
              {this.renderMessage()}
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

Message.defaultProps = {
  sending: false,
  failed: false
}

Message.propTypes = {
  id: PropTypes.string,
  rowId: PropTypes.number,
  text: PropTypes.string,
  sent: PropTypes.string,
  fromUser: PropTypes.object,
  sending: PropTypes.bool,
  failed: PropTypes.bool,
  dispatch: PropTypes.func,
  onResendingMessage: PropTypes.func,
  onLongPress: PropTypes.func
}

export default Message
