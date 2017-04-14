import React, {Component, PropTypes} from 'react';
import {TextInput, Image, View} from 'react-native';
import s from '../styles/components/CustomSearchStyles'
import Button from './Button'

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
          <Image
            style={s.buttonIcon}
            source={require('../images/icons/ic_arrow_back_black_24dp.png')} />
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
        {!!value && value.length !== 0 && (
          <Button
            style={s.button}
            onPress={() => onClearPress()}>
            <Image
              style={s.buttonIcon}
              source={require('../images/icons/ic_close_black_24dp.png')} />
          </Button>
        )}
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
