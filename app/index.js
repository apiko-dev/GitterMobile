import {Provider} from 'react-redux'
import configureStore from './configureStore'

import Application from './screens'

const store = configureStore()
export const rootNavigator = new Application(store, Provider)

rootNavigator.run()
