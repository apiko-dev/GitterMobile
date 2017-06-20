import PropTypes from 'prop-types'
import React from 'react'
import {Image} from 'react-native';


const Avatar = ({src, size}) => {
  return (
    <Image
      style={{
        width: size,
        height: size,
        borderRadius: size / 10,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.1
      }}
      source={{uri: src}} />
  )
}

Avatar.defaultProps = {
  src: 'https://avatars.githubusercontent.com/ammorium?v=3&s=100',
  size: 40
}

Avatar.propTypes = {
  src: PropTypes.string,
  size: PropTypes.number
}

export default Avatar
