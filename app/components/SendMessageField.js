import React, {
  Component,
  PropTypes,
  TextInput,
  TouchableNativeFeedback,
  Image,
  View
} from 'react-native'
import s from '../styles/SendMessageFieldStyles'
import {THEMES} from '../constants'

const {colors} = THEMES.gitterDefault

export default class SendMessageField extends Component {
  constructor(props) {
    super(props)

    this.sendMessage = this.sendMessage.bind(this)

    this.state = {
      height: 56,
      text: ''
    }
  }

  sendMessage() {
    this.props.onSending(this.state.text)
    this.setState({text: '', height: 56})
  }

  render() {
    return (
      <View style={s.container}>
        <TextInput
          multiline
          style={[s.textInput, {height: this.state.height > 90 ? 90 : Math.max(56, this.state.height)}]}
          value={this.state.text}
          underlineColorAndroid={colors.androidGray}
          onChange={(event) => {
            this.setState({
              text: event.nativeEvent.text,
              height: event.nativeEvent.contentSize.height
            })
          }}
          placeholder="Type your message here..." />
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          accessible={!this.state.text.trim() ? false : true}
          onPress={() => this.sendMessage()}>
          <View style={s.button}>
            <Image
              source={require('image!ic_send_black_24dp')}
              style={[s.sendIcon, {opacity: !this.state.text.trim() ? 0.2 : 0.6}]}/>
          </View>
        </TouchableNativeFeedback>
      </View>

    )
  }
}

SendMessageField.propTypes = {
  onSending: PropTypes.func
}
