import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {rootReducer} from './reducers'
import { Middleware } from './middleware'

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

const backend = new Middleware(config)
const backendMiddleware = ({dispatch, getState}) => next => action(dispatch, getState, {backend})

export const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk, backendMiddleware)
)
