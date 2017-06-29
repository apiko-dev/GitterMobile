import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Linking, Image} from 'react-native'
import TransformableImage from 'react-native-transformable-image'
import s from './styles'
import navigationStyles from '../../styles/common/navigationStyles'
import {iconsMap} from '../../utils/iconsMap'

class ImageLightbox extends Component {
  constructor(props) {
    super(props)

    this.handleToggleNavbar = this.handleToggleNavbar.bind(this)

    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    props.navigator.setButtons({
      leftButtons: [{
        title: 'Close',
        id: 'close',
        icon: iconsMap.closeIcon,
        iconColor: 'white',
        showAsAction: 'always'
      }],
      rightButtons: [{
        title: 'Open in Browser',
        icon: iconsMap.browser,
        id: 'open-in-browser',
        iconColor: 'white',
        showAsAction: 'always'
      }]
    })

    this.state = {
      pixels: {},
      showNavBar: true
    }
  }

  componentWillMount() {
    Image.getSize(this.props.url, (width, height) =>
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
      if (event.id === 'open-in-browser') {
        Linking.openURL(this.props.url)
      }
    }
  }

  handleToggleNavbar() {
    const {showNavBar} = this.state
    this.props.navigator.toggleNavBar({
      to: showNavBar ? 'hidden' : 'shown',
      animated: false
    })
    this.setState({showNavBar: !showNavBar})
  }

  render() {
    const {url} = this.props
    const {pixels} = this.state

    return (
      <TransformableImage
        enableTransform
        enableScale
        enableTranslate
        onSingleTapConfirmed={this.handleToggleNavbar}
        pixels={pixels}
        style={s.container}
        source={{uri: url}} />
    )
  }
}

ImageLightbox.navigatorStyle = {
  ...navigationStyles,
  drawUnderNavBar: true
}

ImageLightbox.propTypes = {
  navigator: PropTypes.object,
  url: PropTypes.string
}

export default ImageLightbox
