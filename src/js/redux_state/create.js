import { createStore as _createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'react-router-redux'
import backendMiddleware from './middleware/backend'
import Backend from '../backend'
import createServices from '../services'
import setupObservers from './observers'
import reducer from './reducer'

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history)
  // TODO MOVE TO CONFIG FILE
  const backend = new Backend({
    fuelingEndpoint: 'https://faucet.jolocom.com/request',
    identity: {
      providerUrl: 'https://rinkeby.infura.io/',
      contractAddress: '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
    },
    ipfs: {
      host: 'ipfs.infura.io',
      prot: 5001,
      protocol: 'https'
    }
  })

  const services = createServices(backend)
  if (window) {
    window.dev = {backend, services}
  }

  const middleware = [
    backendMiddleware(backend, services),
    reduxRouterMiddleware
  ]

  let finalCreateStore
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    const { persistState } = require('redux-devtools')
    finalCreateStore = composeWithDevTools(
      applyMiddleware(...middleware),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore)
  }

  const store = finalCreateStore(reducer, data)
  setupObservers({store, services, history})

  if (window.__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(reducer)
    })
  }
  return store
}
