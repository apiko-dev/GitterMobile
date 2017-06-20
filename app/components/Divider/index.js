import PropTypes from 'prop-types'
import React from 'react'
import {View} from 'react-native';

const Divider = ({inset, style, light}) => {
  return (
    <View
      style={[
        {height: 1},
        {marginLeft: inset ? 72 : 0},
        {backgroundColor: light ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.12)'},
        style
      ]} />
  )
}

Divider.defaultProps = {
  light: true
}

Divider.propTypes = {
  inset: PropTypes.bool,
  style: PropTypes.object,
  light: PropTypes.bool
}

export default Divider
