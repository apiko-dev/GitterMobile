import React, {
  Component,
  PropTypes,
  View,
  Text
} from 'react-native'
import processChat from './lib/process-chat'

export default class GitterMarkdown extends Component {
  render() {
    const {text} = this.props
    const content = processChat(text)
    debugger

    if (content === '[object Object]') {
      return (
        <Text>
          {content}
        </Text>
      )
    }
    return (
      <View style={{flex: 1}}>
        {content}
      </View>
    )
  }
}

GitterMarkdown.propTypes = {
  text: PropTypes.string
}
