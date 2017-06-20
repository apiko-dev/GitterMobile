import PropTypes from 'prop-types'
import React from 'react'
import {Image, Text, PixelRatio, Platform} from 'react-native';
import {emoji} from '../../images/emoji'
const iOS = Platform.OS === 'ios'

const Emoji = ({name, styles}) => {
  const source = emoji[name]

  if (!source) {
    return (
      <Text style={styles.wrapper} />
    )
  }

  return (
    <Text style={styles.wrapper}>
      <Image
        style={styles.image}
        source={{uri: `https://gitter.im/_s/l/images/emoji/${source}.png`}} />
    </Text>
  )
}

Emoji.defaultProps = {
  styles: {
    wrapper: {
      fontSize: 14
    },
    image: iOS
      ? { height: 20, width: 20 }
      : {
        height: PixelRatio.getPixelSizeForLayoutSize(20),
        width: PixelRatio.getPixelSizeForLayoutSize(20)
      }
  }
}

Emoji.propTypes = {
  name: PropTypes.string,
  styles: PropTypes.object
}

export default Emoji
