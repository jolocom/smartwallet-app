import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {rootReducer} from './reducers'
import { BackendMiddleware } from './backendMiddleware'
import {AnyAction, Dispatch, Middleware, MiddlewareAPI, Action} from 'redux'

const config = {
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  identity: {
    providerUrl: 'https://rinkeby.infura.io/',
    contractAddress: '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
  },
  ipfs: {
    host: 'ipfs.jolocom.com',
    port: 443,
    protocol: 'https'
  }
}

const backendMiddleware = new BackendMiddleware(config)

const {
  createReactNavigationReduxMiddleware
} = require('react-navigation-redux-helpers')

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  (state : any) => state.navigation
)

export const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk.withExtraArgument({backendMiddleware}))
)
