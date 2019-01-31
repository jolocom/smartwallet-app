import { combineReducers } from 'redux'
import { accountReducer, AccountState } from 'src/reducers/account/'
import { registrationReducer, RegistrationState } from 'src/reducers/registration/'
import { navigationReducer } from 'src/reducers/navigation/'
import { NavigationState } from 'react-navigation'
import { ssoReducer, SsoState } from 'src/reducers/sso/'
import { paymentReducer, PaymentState } from 'src/reducers/payment'

export const rootReducer =  combineReducers({
  account: accountReducer,
  registration: registrationReducer,
  navigation: navigationReducer,
  sso: ssoReducer,
  payment: paymentReducer
})

export interface RootState {
  readonly account: AccountState;
  readonly registration: RegistrationState;
  readonly navigation: NavigationState;
  readonly sso: SsoState;
  readonly payment: PaymentState
}
