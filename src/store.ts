import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { RootState, rootReducer } from 'src/reducers'
import { BackendMiddleware } from 'src/backendMiddleware'
import config from 'src/config'
import { Store } from 'react-redux'

import {
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

export function initStore(): Store<any> {
  const backendMiddleware = new BackendMiddleware(config)

  const navMiddleware = createReactNavigationReduxMiddleware(
    (state: RootState) => state.navigation,
  );

  return createStore(
    rootReducer,
    {},
    applyMiddleware(thunk.withExtraArgument(backendMiddleware), navMiddleware),
  )
}
