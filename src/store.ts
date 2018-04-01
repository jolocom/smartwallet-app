import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { rootReducer } from 'src/reducers'
const {
  createReactNavigationReduxMiddleware
} = require('react-navigation-redux-helpers')

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  (state : any) => state.navigation
)

const middleware = applyMiddleware(thunk, navMiddleware)
export const store = createStore(rootReducer,  {}, middleware)
