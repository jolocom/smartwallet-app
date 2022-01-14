import {
  AusweisModuleActions,
  AusweisModuleState,
  SetAusweisDetailsAction,
  SetAusweisReaderStateAction,
  SetAusweisScannerKeyAction,
  SetAusweisFlowTypeAction,
} from './types'

const initialState: AusweisModuleState = {
  details: null,
  scannerKey: null,
  readerState: null,
  flowType: null,
}

const reducer = (
  state = initialState,
  action:
    | SetAusweisDetailsAction
    | SetAusweisScannerKeyAction
    | SetAusweisReaderStateAction
    | SetAusweisFlowTypeAction,
): AusweisModuleState => {
  switch (action.type) {
    case AusweisModuleActions.setDetails:
      return { ...state, details: action.payload }
    case AusweisModuleActions.setScannerKey:
      return { ...state, scannerKey: action.payload }
    case AusweisModuleActions.setReaderState:
      return { ...state, readerState: action.payload }
    case AusweisModuleActions.setFlowType:
      return { ...state, flowType: action.payload }
    default:
      return state
  }
}

export default reducer
