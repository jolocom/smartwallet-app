import { Routes } from 'src/routes'

import {
  createNavigationReducer,
} from 'react-navigation-redux-helpers';


export const navigationReducer = createNavigationReducer(Routes)
