import createAction from '~/utils/createAction';
import {LoaderActions} from './types';

export const resetLoader = createAction(LoaderActions.reset);
export const setLoader = createAction(LoaderActions.set);
