import { combineReducers } from 'redux'
import { accountReducer, AccountState } from 'src/reducers/account/'
import { registrationReducer, RegistrationState } from 'src/reducers/registration/'
import { navigationReducer } from 'src/reducers/navigation/'

export const rootReducer =  combineReducers({
  account: accountReducer,
  registration: registrationReducer,
  navigation: navigationReducer
})

export interface RootState {
  readonly account: AccountState;
  readonly registration: RegistrationState;
  readonly navigation: any;
}
