// disable react-native warning boxes
console.disableYellowBox = true

import { initSentry } from './src/lib/errors/sentry'
initSentry()

import { AppRegistry } from 'react-native'
import App from './src/App'
import 'react-native-gesture-handler'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
