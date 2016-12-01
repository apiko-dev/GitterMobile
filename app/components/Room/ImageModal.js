import React, {PropTypes, Component} from 'react'
import {Modal, Image, View} from 'react-native'
import TransformableImage from 'react-native-transformable-image'
import Button from '../Button'
import Loading from '../Loading'

class ImageModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showSpinner: false
    }
  }

  render() {
    const {
      onRequestClose,
      visible,
      width,
      height,
      imageModalUrl
    } = this.props
    const {showSpinner} = this.state

    return (
      <Modal
        onRequestClose={onRequestClose}
        animationType="none"
        transparent
        visible={visible}>
        <View
          style={{flex: 1}}>
          <TransformableImage
            onLoadStart={() => this.setState({showSpinner: true})}
            onLoad={() => this.setState({showSpinner: false})}
            style={{width, height, backgroundColor: 'black'}}
            source={{uri: imageModalUrl}} />
          <Button
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 30,
              height: 30,
            }}
            onPress={onRequestClose}>
            <Image
              style={{width: 30, height: 30}}
              source={require('image!ic_close_white_24dp')} />
          </Button>


        </View>
      </Modal>
    )
  }
}

ImageModal.propTypes = {
  onRequestClose: PropTypes.func,
  visible: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  imageModalUrl: PropTypes.string
}

export default ImageModal
