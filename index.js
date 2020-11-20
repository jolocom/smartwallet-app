import './globals'

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

import { initSentry } from '~/errors/sentry'

initSentry()

AppRegistry.registerComponent(appName, () => App)
