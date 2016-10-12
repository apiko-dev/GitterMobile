import {ActionSheetIOS} from 'react-native'

const BottomSheet = {
  showBotttomSheetWithOptions({title, items}, callback) {
    const options = {
      title: title || '',
      options: items.concat('Close'),
      cancelButtonIndex: items.length
    }

    ActionSheetIOS.showActionSheetWithOptions(
      options,
      index => index === items.length // Close
        ? () => {}
        : callback(index, items[index])
    )
  }
}

export default BottomSheet
