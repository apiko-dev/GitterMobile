import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import s from './styles'

import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

import Icon from 'react-native-vector-icons/MaterialIcons'

const SearchField = ({onPress}) => (
  <View style={s.container}>
    <Icon.Button
      name="search"
      size={18}
      color={colors.androidGray}
      backgroundColor={colors.darkRed}
      onPress={() => onPress()}>
      Search
    </Icon.Button>
  </View>
)

export default SearchField
