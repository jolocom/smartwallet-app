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

export interface ExtendedMiddlewareAPI<S=any, D=Action, B=BackendMiddleware> extends MiddlewareAPI<S> {
  backendMiddleware: BackendMiddleware
}

export interface ExtendedMiddleware<S=any, D=Action> {
(api: MiddlewareAPI<S>, middleware: BackendMiddleware): (next: Dispatch<D>) => Dispatch<D>
}

const middleware = new BackendMiddleware(config)
const backendExtendedMiddleware: ExtendedMiddleware = (api: MiddlewareAPI<any>, middleware: BackendMiddleware) =>
  (next: Dispatch<any>) => <A extends Action>(action : A) : A => {
    if (typeof action === 'function') {
    return next(action(api.dispatch, api.getState, {middleware}))
  } else {
    return next(action)
  }
}


export const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk, backendExtendedMiddleware(middleware))
)
