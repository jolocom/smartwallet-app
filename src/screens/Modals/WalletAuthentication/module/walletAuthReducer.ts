import { StateI, ActionI, WalletAuthActions } from './walletAuthTypes'

export const initialState = {
  biometryType: undefined,
  isPasscodeView: true,
}

const reducer = (state: StateI, action: ActionI) => {
  switch (action.type) {
    case WalletAuthActions.setBiometryType:
      return { ...state, biometryType: action.payload }
    case WalletAuthActions.showBiometry:
      return { ...state, isPasscodeView: false }
    default:
      return initialState
  }
}

export default reducer
