import {LoaderStateI, LoaderMsgs} from '~/types/loader';

import {LoaderActions, LoaderTypes} from '~/types/loader';

type Actions = {
  type: LoaderActions;
  payload?: any;
};

const initialState: LoaderStateI = {
  type: LoaderTypes.default,
  msg: LoaderMsgs.empty,
};

const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case LoaderActions.set:
      return action.payload;
    case LoaderActions.dismiss:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
