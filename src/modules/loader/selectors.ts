import {RootReducerI} from '~/types/reducer';
import {LoaderStateI} from '~/types/loader';

export const getLoaderState = (state: RootReducerI): LoaderStateI =>
  state.loader;
