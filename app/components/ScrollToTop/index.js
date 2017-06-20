import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  TouchableOpacity,
  Animated
} from 'react-native'
import s from './styles'
import Icon from 'react-native-vector-icons/MaterialIcons'

class ScrollToTop extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bottom: new Animated.Value(-54)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      Animated.timing(
        this.state.bottom,
        {
          toValue: nextProps.visible ? 0 : -54,
          duration: 200
        },
      ).start()
    }
  }

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

    return (
      <Animated.View
        style={{bottom: this.state.bottom}}>
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
      </Animated.View>
    );
  }
}

ScrollToTop.defaultProps = {
  isRadius: true,
  width: 60,
  height: 60,
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
  iconSize: PropTypes.number,
  visible: PropTypes.bool
}

export default ScrollToTop
