import React, {Component, PropTypes} from 'react';
import {TextInput, Image, View, Text} from 'react-native';
import Button from '../Button'
import s from '../../styles/screens/Room/SendMessageFieldStyles'

export default class SendMessageField extends Component {
  constructor(props) {
    super(props)

    this.sendMessage = this.sendMessage.bind(this)
    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
    this.handleChangeSize = this.handleChangeSize.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)

    this.state = {
      height: 46,
      value: ''
    }
  }

  componentWillMount() {
    this.setState({value: this.props.value})
  }

  componentWillReceiveProps({value}) {
    if (!this.state.value.length) {
      this.setState({value})
    }
  }

  // componentDidMount() {
  //   setTimeout(() => this.setState({height: }))
  // }

  handleChangeSize(e) {
    this.setState({height: e.nativeEvent.layout.height})
  }

  handleChangeText(value) {
    const {onChange} = this.props
    this.setState({value})
    onChange(value)
  }

  focus() {
    this.refs.textInput.focus()
  }

  blur() {
    this.refs.textInput.blur()
  }

  sendMessage() {
    const {value, onSending} = this.props
    if (!value.trim()) {
      return
    }
    onSending()
    this.setState({height: 46, value: ''})
  }

  render() {
    const {value, height} = this.state
    const {emojis, onRightAddIconPress} = this.props
    return (
      <View style={s.container}>
        <View style={s.innerContainer}>
          <TextInput
            ref="textInput"
            multiline
            style={[s.textInput, {height: height > 90 ? 90 : Math.max(46, height)}]}
            value={value}
            keyboardShouldPersistTaps={false}
            underlineColorAndroid="white"
            onChangeText={this.handleChangeText}
            placeholder="Type your message here..." />
            <Text
              ref="hidden"
              onLayout={this.handleChangeSize}
              style={s.hidden}>
               {value}
             </Text>
        </View>
        <View style={s.rightButtons}>
          <Button
            background="SelectableBackgroundBorderless"
            onPress={() => onRightAddIconPress()}
            style={[s.button, s.left]}>
            <Image
              source={emojis ? require('image!ic_keyboard_black_24dp') : require('image!ic_insert_emoticon_black_24dp')}
              style={s.sendIcon} />
          </Button>
          <Button
            background="SelectableBackgroundBorderless"
            onPress={() => this.sendMessage()}
            style={s.button}>
            <Image
              source={require('image!ic_send_black_24dp')}
              style={[s.sendIcon, {opacity: !value.trim() ? 0.4 : 0.8}]}/>
          </Button>
        </View>
      </View>

    )
  }
}

SendMessageField.propTypes = {
  onSending: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  emojis: PropTypes.bool,
  onRightAddIconPress: PropTypes.func
}
