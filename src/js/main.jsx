import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import injectTapEventPlugin from 'react-tap-event-plugin'

import { AppContainer } from 'react-hot-loader'

import createStore from 'redux_state/create'

injectTapEventPlugin()

import {locale} from 'moment'

locale('en', {
  relativeTime: {
    future: 'in %s',
    past: function (number/*, withoutSuffix, key, isFuture*/) {
      return number
    },
    s: 'just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%ddays',
    M: '1m',
    MM: '%dm',
    y: '1y',
    yy: '%dy'
  }
})

let rootEl = document.getElementById('app')

const store = createStore(hashHistory)
const createSelectLocationState = () => {
  let prevRoutingState, prevRoutingStateJS
  return (state) => {
    const routingState = state.get('routing')
    if (typeof prevRoutingState === 'undefined' ||
        prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState
    }
    return prevRoutingStateJS
  }
}
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: createSelectLocationState()
})

const render = () => {
  ReactDOM.render(<AppContainer>
    <Provider store={store}>
      {require('routes').default(history)}
    </Provider>
  </AppContainer>, rootEl)
}

render()

if (module.hot) {
  module.hot.accept('routes', () => {
    render()
  })
}
