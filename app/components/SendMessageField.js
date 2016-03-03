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
      height: 56
    }
  }

  componentWillReceiveProps(nextProps) {
    const {focus} = nextProps
    if (focus) {
      this.refs.textInput.focus()
    } else {
      this.refs.textInput.blur()
    }
  }

  sendMessage() {
    this.props.onSending()
    this.setState({ height: 56})
  }

  render() {
    const {value, onChange, onFocus, onBlur} = this.props
    return (
      <View style={s.container}>
        <TextInput
          ref="textInput"
          multiline
          style={[s.textInput, {height: this.state.height > 90 ? 90 : Math.max(56, this.state.height)}]}
          value={value}
          onFocus={() => onFocus()}
          onBlur={() => onBlur()}
          underlineColorAndroid={colors.androidGray}
          onChange={(event) => {
            this.setState({
              height: event.nativeEvent.contentSize.height
            })
            onChange(event.nativeEvent.text)
          }}
          placeholder="Type your message here..." />
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          onPress={() => this.sendMessage()}>
          <View style={s.button}>
            <Image
              source={require('image!ic_send_black_24dp')}
              style={[s.sendIcon, {opacity: !value.trim() ? 0.2 : 0.6}]}/>
          </View>
        </TouchableNativeFeedback>
      </View>

    )
  }
}

SendMessageField.propTypes = {
  onSending: PropTypes.func,
  value: PropTypes.func,
  onChange: PropTypes.func,
  focus: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}
