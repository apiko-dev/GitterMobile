import {Provider} from 'react-redux'
import configureStore from './configureStore'

import Application from './screens'

const store = configureStore()
const app = new Application(store, Provider)

app.run()
