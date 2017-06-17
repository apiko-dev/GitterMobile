import React, {PropTypes, Component} from 'react'
import {Platform, Image as RNImage} from 'react-native'
import Image from 'react-native-transformable-image'
import s from './styles'
import navigationStyles from '../../styles/common/navigationStyles'

class TransformableImage extends Component {
  constructor(props) {
    super(props)

    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    props.navigator.setButtons(
      Platform.OS === 'ios'
        ? {
          leftButtons: [{
            title: 'Close',
            id: 'close',
            iconColor: 'white',
            showAsAction: 'always'
          }]
        }
        : {}
    )

    this.state = {
      pixels: {}
    }
  }

  componentWillMount() {
    RNImage.getSize(this.props.url, (width, height) =>
      this.setState({pixels: {width, height}})
    )
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        })
      }
    }
  }

  render() {
    const {url} = this.props
    const {pixels} = this.state

    return (
      <Image
        enableTransform
        enableScale
        enableTranslate
        pixels={pixels}
        style={s.container}
        source={{uri: url}} />
    )
  }
}

TransformableImage.navigatorStyle = {
  ...navigationStyles,
  navBarTransparent: true,
  drawUnderNavBar: true,
  navBarBlur: true
}

TransformableImage.propTypes = {
  navigator: PropTypes.object,
  url: PropTypes.string
}

export default TransformableImage
