import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { IpfsLib } from 'src/lib/ipfs'
import { entityList } from 'src/lib/storage/entities'
import { ILibConfig } from 'jolocom-lib/js/types'
import { defaultConfig } from 'jolocom-lib/js/defaultConfig'
import { RootState, rootReducer } from 'src/reducers'
import { BackendMiddleware } from 'src/backendMiddleware'
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
