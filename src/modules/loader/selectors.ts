import {createSelector} from 'reselect';

import {RootReducerI} from '~/types/reducer';
import {LoaderStateI} from '~/types/loader';

export const getLoaderState = (state: RootReducerI): LoaderStateI =>
  state.loader;

export const getLoaderType = createSelector(
  getLoaderState,
  (loader) => loader.type,
);

export const getLoaderMsg = createSelector(
  getLoaderState,
  (loader) => loader.msg,
);
