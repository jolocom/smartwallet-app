import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'

import injectTapEventPlugin from 'react-tap-event-plugin'

import { AppContainer } from 'react-hot-loader'

import Routes from './routes.jsx'

injectTapEventPlugin()

import moment from 'moment'

moment.locale('en', {
  relativeTime : {
    future: 'in %s',
    past: function (number/*, withoutSuffix, key, isFuture*/) {
      // console.log(number, withoutSuffix, key, isFuture)
      return number
    },
    s: 'just now',
    m: '1m',
    mm: '%dm',
    h:  '1h',
    hh: '%dh',
    d:  '1d',
    dd: '%ddays',
    M:  '1m',
    MM: '%dm',
    y:  '1y',
    yy: '%dy'
  }
})

let rootEl = document.getElementById('app')

ReactDOM.render(<AppContainer><Routes/></AppContainer>, rootEl)

if (module.hot) {
  module.hot.accept('./routes.jsx', () => {
    ReactDOM.render(
      <AppContainer component={require('./routes.jsx').default} />,
      rootEl
    )
  })
}
