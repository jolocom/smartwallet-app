import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { rootReducer, RootState } from './reducers'
import { BackendMiddleware } from './backendMiddleware'
import { IpfsLib } from 'src/lib/ipfs'
import { entityList } from 'src/lib/storage/entities'
import { ILibConfig } from 'jolocom-lib/js/types'
const { createReactNavigationReduxMiddleware } = require('react-navigation-redux-helpers')

const jolocomLibConfig: ILibConfig = {
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

// TODO Break apart
const config = {
  jolocomLibConfig,
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: {
    type: 'react-native',
      database: 'LocalSmartWalletData',
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: entityList
  }
}

createReactNavigationReduxMiddleware('root', (state : RootState) => state.navigation)
const backendMiddleware = new BackendMiddleware(config)

export const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk.withExtraArgument(backendMiddleware))
)
