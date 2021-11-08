import {
  AusweisModuleActions,
  AusweisModuleState,
  SetAusweisDetailsAction,
  SetAusweisScannerKeyAction,
} from './types'

const initialState: AusweisModuleState = {
  details: null,
  scannerKey: null,
}

const reducer = (
  state = initialState,
  action: SetAusweisDetailsAction | SetAusweisScannerKeyAction,
): AusweisModuleState => {
  switch (action.type) {
    case AusweisModuleActions.setDetails:
      return { ...state, details: action.payload }
    case AusweisModuleActions.setScannerKey:
      return { ...state, scannerKey: action.payload }
    default:
      return state
  }
}

export default reducer
