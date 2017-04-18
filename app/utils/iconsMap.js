import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {icons} from '../constants'

const replaceSuffixPattern = /-(white|black)/g;

export const iconsMap = {};
export const iconsLoaded = new Promise((resolve, reject) => {
  new Promise.all(
    Object.keys(icons).map(iconName => {
      const Provider = MaterialIcons
      return Provider.getImageSource(
        iconName.replace(replaceSuffixPattern, ''),
        icons[iconName][0],
        icons[iconName][1]
      )
    })
  ).then(sources => {
    Object.keys(icons)
      .forEach((iconName, idx) => iconsMap[iconName] = sources[idx])

    // Call resolve (and we are done)
    resolve(true);
  })
})

export default iconsMap
