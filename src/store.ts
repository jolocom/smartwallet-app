import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { rootReducer, RootState } from './reducers'
import { BackendMiddleware } from './backendMiddleware'
import { IpfsLib } from 'src/lib/ipfs'
import { entityList } from 'src/lib/storage/entities'
import { ILibConfig } from 'jolocom-lib/js/types'
import { defaultConfig } from 'jolocom-lib/js/defaultConfig'
const { createReactNavigationReduxMiddleware } = require('react-navigation-redux-helpers')

const jolocomLibConfig: ILibConfig = Object.assign({}, defaultConfig, {
  IpfsConnector: new IpfsLib()
})

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
