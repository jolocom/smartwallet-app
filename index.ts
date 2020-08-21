import 'reflect-metadata'

// react-native overrides Object.assign with a non-spec-compliant version.
// bring it back because some dependencies break otherwise
const assign = require('object.assign/implementation')
Object.assign = assign

// react-native uses a old version of JS Core that does not support
// String.prototype.normalize. This is used in bip39 and therefore needs a polyfill
String.prototype.normalize = function(form: string): string {
  return require('unorm')[String(form).toLowerCase()](this)
}

// required as some dependencies (ethereum stuff) think we are node and check
// the version
process.version = 'v11.13.0'

/**
 * Object.setPrototypeOf polyfill because typeorm (and possibly others) use it
 */

// @ts-ignore
if (!Object.setPrototypeOf) {
  // @ts-ignore
  Object.setPrototypeOf = function(obj, proto) {
    obj.__proto__ = proto
    return obj
  }
}

// disable react-native warning boxes
console.disableYellowBox = true

import { initErrorReporting } from 'src/lib/errors'
initErrorReporting()

// This import needs to remain here due to tremendous amounts of unpaid
// Tech Debt between react-native and react-navigation and react-native-screens
// and react-native-gesture-handler....
// If removed from here the application will crash about
// "onGestureHandlerStateChange" when using gestures to dismiss
//
// https://github.com/software-mansion/react-native-gesture-handler/pull/792#issuecomment-661834769
import 'react-native-gesture-handler'

import { AppRegistry } from 'react-native'

import App from 'src/App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
