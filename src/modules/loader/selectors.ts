import {createSelector} from 'reselect';

export const getLoaderState = (state) => state.loader;

export const getLoaderType = createSelector(
  getLoaderState,
  (loader) => loader.type,
);

export const getLoaderMsg = createSelector(
  getLoaderState,
  (loader) => loader.msg,
);
