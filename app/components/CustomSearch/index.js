import React, {Component, PropTypes} from 'react';
import {TextInput, View, Platform} from 'react-native';
import s from './styles'
import Button from '../Button'
import Icon from 'react-native-vector-icons/MaterialIcons'

class CustomSearch extends Component {
  constructor(props) {
    super(props)

    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
  }

  focus() {
    this.refs.textInput.focus()
  }

  blur() {
    this.refs.textInput.blur()
  }

  render() {
    const {value, onChange, onBackPress, onClearPress} = this.props
    return (
      <View style={s.container}>
        <Button
          style={s.button}
          onPress={() => onBackPress()}>
          <Icon
            style={{opacity: 0.6}}
            name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-back'}
            color="black"
            size={26} />
        </Button>
        <View style={s.innerContainer}>
          <TextInput
            ref="textInput"
            style={s.textInput}
            value={value}
            keyboardShouldPersistTaps={false}
            underlineColorAndroid="white"
            placeholderTextColor="gray"
            onChange={onChange}
            placeholder="Search" />
        </View>
        {!!value && value.length !== 0 ? (
          <Button
            style={s.button}
            onPress={() => onClearPress()}>
            <Icon
              style={{opacity: 0.6}}
              name="close"
              color="black"
              size={25} />
          </Button>
        ) : (<View style={s.button} />)}
      </View>
    )
  }
}

CustomSearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBackPress: PropTypes.func,
  onClearPress: PropTypes.func
}

export default CustomSearch
