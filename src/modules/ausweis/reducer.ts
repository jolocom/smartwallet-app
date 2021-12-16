import {
  AusweisModuleActions,
  AusweisModuleState,
  SetAusweisDetailsAction,
  SetAusweisReaderStateAction,
  SetAusweisScannerKeyAction,
} from './types'

const initialState: AusweisModuleState = {
  details: null,
  scannerKey: null,
  readerState: false,
}

const reducer = (
  state = initialState,
  action:
    | SetAusweisDetailsAction
    | SetAusweisScannerKeyAction
    | SetAusweisReaderStateAction,
): AusweisModuleState => {
  switch (action.type) {
    case AusweisModuleActions.setDetails:
      return { ...state, details: action.payload }
    case AusweisModuleActions.setScannerKey:
      return { ...state, scannerKey: action.payload }
    case AusweisModuleActions.setReaderState:
      return { ...state, readerState: action.payload }
    default:
      return state
  }
}

export default reducer
