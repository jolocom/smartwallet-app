import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { IConfig } from 'jolocom-lib'
import { rootReducer } from './reducers'
import { BackendMiddleware } from './backendMiddleware'
import { IpfsLib } from 'src/lib/ipfs'
const { createReactNavigationReduxMiddleware } = require('react-navigation-redux-helpers')

createReactNavigationReduxMiddleware('root', (state : any) => state.navigation)

const jolocomLibConfig: IConfig = {
  identity: {
    providerUrl: 'https://rinkeby.infura.io/',
    contractAddress: '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
  },
  ipfs: {
    host: 'ipfs.jolocom.com',
    port: 443,
    protocol: 'https'
  },
  IpfsConnector: new IpfsLib()
}

const config = {
  jolocomLibConfig,
  fuelingEndpoint: 'https://faucet.jolocom.com/request'
}

const backendMiddleware = new BackendMiddleware(config)


export const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk.withExtraArgument(backendMiddleware))
)
