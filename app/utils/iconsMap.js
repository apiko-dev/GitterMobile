import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {icons} from '../constants'

export const iconsMap = {};
export const iconsLoaded = new Promise((resolve, reject) => {
  new Promise.all(
    Object.keys(icons).map(iconName => {
      const icon = icons[iconName]
      const Provider = MaterialIcons
      return Provider.getImageSource(
        icon.icon,
        icon.size,
        icon.color
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
