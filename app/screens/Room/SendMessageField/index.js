import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {TextInput, View, Text, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '../../../components/Button'
import s from './styles'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

export default class SendMessageField extends Component {
  constructor(props) {
    super(props)

    this.sendMessage = this.sendMessage.bind(this)
    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
    this.handleChangeSize = this.handleChangeSize.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)

    this.state = {
      height: 40,
      value: ''
    }
  }

  componentWillMount() {
    this.setState({value: this.props.value})
  }

  componentWillReceiveProps({value}) {
    if (this.props.value !== value) {
      this.setState({value})
    }
  }

  // componentDidMount() {
  //   setTimeout(() => this.setState({height: }))
  // }

  handleChangeSize(e) {
    this.setState({height: e.nativeEvent.layout.height + 30})
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
    this.setState({height: 40, value: ''})
  }

  render() {
    const {value, height} = this.state
    const {editing} = this.props
    const MAX_HEIGHT = Platform.OS === 'android' ? Math.max(40, height) : 'auto'

    return (
      <View style={s.container}>
        <View style={s.innerContainer}>
          <TextInput
            ref="textInput"
            multiline
            style={[s.textInput, {height: height > 90 ? 90 : MAX_HEIGHT}]}
            value={value}
            keyboardShouldPersistTaps={false}
            underlineColorAndroid="white"
            onChangeText={this.handleChangeText}
            placeholder="Message..." />
            <Text
              ref="hidden"
              onLayout={this.handleChangeSize}
              style={s.hidden}>
               {value}
             </Text>
        </View>
        <Button
          background="SelectableBackgroundBorderless"
          onPress={() => this.sendMessage()}
          style={s.button}>
          <Icon
            style={{opacity: !value.trim() ? 0.5 : 1}}
            name={editing ? 'check' : 'send'}
            color={colors.raspberry}
            size={28} />
        </Button>
      </View>

    )
  }
}

SendMessageField.propTypes = {
  onSending: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  editing: PropTypes.bool
}
