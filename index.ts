// disable react-native warning boxes
console.disableYellowBox = true

import { initErrorReporting } from './src/lib/errors'
initErrorReporting()

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
