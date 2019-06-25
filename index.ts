import 'reflect-metadata'

// react-native overrides Object.assign with a non-spec-compliant version.
// bring it back because some dependencies break otherwise
const assign = require('object.assign/implementation')
Object.assign = assign

// required as some dependencies (ethereum stuff) think we are node and check
// the version
process.version = 'v11.13.0'

// disable react-native warning boxes
console.disableYellowBox = true

import { AppRegistry } from 'react-native'
import App from 'src/App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
