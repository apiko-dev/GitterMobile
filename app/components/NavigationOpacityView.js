import React, {
  Animated,
  View,
  StyleSheet,
  addons
} from 'react-native'

const {PureRenderMixin} = addons

/**
 * Component that renders the scene as card for the <NavigationCardStack />.
 */
class NavigationOpacityView extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return PureRenderMixin.shouldComponentUpdate.call(
      this,
      nextProps,
      nextState
    )
  }

  render() {
    const {
      direction,
      layout,
      navigationState,
      onNavigate,
      position,
      scene,
      scenes
    } = this.props

    const index = scene.index;
    const inputRange = [index - 1, index];
    const animatedStyle = {
      opacity: position.interpolate({
        inputRange,
        outputRange: [0.5, 1]
      })
    };

    return (
      <Animated.View
        style={[styles.main, animatedStyle]}>
        {this.props.renderScene(this.props)}
      </Animated.View>
    )
  }


}

const styles = StyleSheet.create({
  main: {
    // backgroundColor: '#E9E9EF',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default NavigationOpacityView
