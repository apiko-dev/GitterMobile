import React, {PropTypes} from 'react';
import {Image, Text} from 'react-native';
import {emoji} from '../images/emoji'

const Emoji = ({name, styles}) => {
  let newName = null

  if (name === '+1') {
    newName = 'plus_1'
  } else if (name === '-1') {
    newName = 'minus1'
  } else {
    newName = name
  }

  const source = emoji[newName]

  if (!source) {
    return (
      <Text style={styles.wrapper} />
    )
  }

  return (
    <Text style={styles.wrapper}>
      <Image
        style={styles.image}
        source={source} />
    </Text>
  )
}

Emoji.defaultProps = {
  styles: {
    wrapper: {
      fontSize: 14
    },
    image: {
      height: 20,
      width: 20
    }
  }
}

Emoji.propTypes = {
  name: PropTypes.string,
  styles: PropTypes.object
}

export default Emoji
