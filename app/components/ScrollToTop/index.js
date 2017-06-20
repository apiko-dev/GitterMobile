import React, {Component, PropTypes} from 'react'
import {
  Dimensions,
  TouchableOpacity,
  PixelRatio,
  View
} from 'react-native'
import s from './styles'
import Icon from 'react-native-vector-icons/MaterialIcons'

class ScrollToTop extends Component {
  _onPress() {
    this.props.root.refs.listview.scrollTo({x: 0, y: 0, animated: true});
  }

  render() {
    const {
      isRadius,
      borderRadius,
      backgroundColor,
      width,
      height,
      right,
      bottom,
      icon,
      iconSize
    } = this.props

    const size = PixelRatio.getPixelSizeForLayoutSize(iconSize)

    return (
      <TouchableOpacity
        onPress={this._onPress.bind(this)}
        style={[s.container, {
          borderRadius: isRadius ? borderRadius : 0,
          backgroundColor,
          width,
          height,
          right,
          bottom
        }]}>
          <Icon
            size={iconSize}
            color="white"
            name={icon} />
      </TouchableOpacity>
    );
  }
}

ScrollToTop.defaultProps = {
  isRadius: true,
  width: 60,
  height: 60,
  right: Dimensions.get('window').width - 80,
  top: Dimensions.get('window').height - 160,
  borderRadius: 30,
  backgroundColor: 'white'
}

ScrollToTop.propTypes = {
  isRadius: PropTypes.bool,
  borderRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  right: PropTypes.number,
  children: PropTypes.element,
  root: PropTypes.object,
  bottom: PropTypes.number,
  icon: PropTypes.string,
  iconSize: PropTypes.number
}

export default ScrollToTop
