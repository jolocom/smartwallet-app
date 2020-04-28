import {combineReducers} from 'redux';

import loaderReducer from './loader/reducers';

const rootReducer = combineReducers({
  loader: loaderReducer,
});

export default rootReducer;
