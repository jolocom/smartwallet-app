import {LoaderMsgs} from '~/types/loaderMessages';
import {LoaderActions, LoaderTypes} from './types';

type Actions = {
  type: LoaderActions;
  payload?: any;
};

interface StateI {
  type: LoaderTypes;
  msg: LoaderMsgs;
}

const initialState: StateI = {
  type: LoaderTypes.default,
  msg: LoaderMsgs.empty,
};

const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case LoaderActions.set:
      return action.payload;
    case LoaderActions.reset:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
