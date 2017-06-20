import PropTypes from 'prop-types'
import React from 'react'
import {TextInput, View, Platform} from 'react-native';
import s from './styles'
import Button from '../Button'
import Icon from 'react-native-vector-icons/MaterialIcons'

const CustomSearch = (props) => {
  const {value, onChange, onBackPress, onClearPress} = props

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
      <TextInput
        style={s.textInput}
        value={value}
        keyboardShouldPersistTaps={false}
        underlineColorAndroid="white"
        placeholderTextColor="gray"
        onChange={onChange}
        placeholder="Search" />
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

CustomSearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBackPress: PropTypes.func,
  onClearPress: PropTypes.func
}

export default CustomSearch
