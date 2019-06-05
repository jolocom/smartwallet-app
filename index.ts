import 'reflect-metadata'

// required as some dependencies (ethereum stuff) think we are node and check
// the version
process.version = 'v11.13.0'

import {AppRegistry} from 'react-native'
import App from 'src/App'
import {name as appName} from './app.json'

AppRegistry.registerComponent(appName, () => App)
