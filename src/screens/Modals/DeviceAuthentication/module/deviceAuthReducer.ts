import { StateI, ActionI, DeviceAuthActions } from './deviceAuthTypes'

export const initialState = {
  biometryType: undefined,
  isPasscodeView: true,
}

const reducer = (state: StateI, action: ActionI) => {
  switch (action.type) {
    case DeviceAuthActions.setBiometryType:
      return { ...state, biometryType: action.payload }
    case DeviceAuthActions.showBiometry:
      return { ...state, isPasscodeView: false }
    default:
      return initialState
  }
}

export default reducer
