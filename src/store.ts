import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { entityList } from 'src/lib/storage/entities'
import { RootState, rootReducer } from 'src/reducers'
import { BackendMiddleware } from 'src/backendMiddleware'
import { ConnectionOptions } from 'typeorm/browser'

const {
  createReactNavigationReduxMiddleware,
} = require('react-navigation-redux-helpers')

const typeOrmConf: ConnectionOptions = {
  type: 'react-native',
  database: 'LocalSmartWalletData',
  location: 'default',
  logging: ['error', 'query', 'schema'],
  synchronize: true,
  entities: entityList,
}

const config = {
  fuelingEndpoint: 'https://faucet.jolocom.com/request',
  typeOrmConfig: typeOrmConf,
}

createReactNavigationReduxMiddleware(
  'root',
  (state: RootState) => state.navigation,
)
const backendMiddleware = new BackendMiddleware(config)

export const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk.withExtraArgument(backendMiddleware)),
)
