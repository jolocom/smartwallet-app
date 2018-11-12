import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { entityList } from 'src/lib/storage/entities'
import { defaultConfig } from 'jolocom-lib/js/defaultConfig'
import { RootState, rootReducer } from 'src/reducers'
import { BackendMiddleware } from 'src/backendMiddleware'
import { ReactNativeStorageConfig } from 'src/lib/storage/types'
const { createReactNavigationReduxMiddleware } = require('react-navigation-redux-helpers')

const TORMConfig: ReactNativeStorageConfig = {
  type: 'react-native',
  database: 'LocalSmartWalletData',
  location: 'default',
  logging: ['error', 'query', 'schema'],
  synchronize: true,
  entities: entityList
}

const config = {
  defaultConfig,
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: TORMConfig
}

createReactNavigationReduxMiddleware('root', (state: RootState) => state.navigation)
const backendMiddleware = new BackendMiddleware(config)

export const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk.withExtraArgument(backendMiddleware))
)
