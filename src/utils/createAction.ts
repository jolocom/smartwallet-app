import {LoaderActions} from '~/modules/loader/types';

const createAction = (type: LoaderActions) => {
  const actionCreator = (payload?: any) => ({
    type,
    payload,
  });

  actionCreator.type = type;

  return actionCreator;
};

export default createAction;
