import React, {
  Component,
  PropTypes,
  TextInput,
  View
} from 'react-native'
import s from '../styles/SendMessageFieldStyles'
import {THEMES} from '../constants'

const {colors} = THEMES.gitterDefault

export default class SendMessageField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      height: 56,
      text: ''
    }
  }

  render() {
    return (
        <TextInput
          multiline
          style={[s.container, {height: this.state.height > 90 ? 90 : Math.max(56, this.state.height)}]}
          value={this.state.text}
          underlineColorAndroid={colors.androidGray}
          onChange={(event) => {
            this.setState({
              text: event.nativeEvent.text,
              height: event.nativeEvent.contentSize.height
            })
          }}
          placeholder="Type your message here..." />


    )
  }
}
