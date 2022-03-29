import {
  setAusweisInteractionDetails,
  setAusweisReaderState,
  setAusweisScannerKey,
  setAusweisFlowType,
} from './actions'
import { AusweisActionType, AusweisModuleState } from './types'

const initialState: AusweisModuleState = {
  details: null,
  scannerKey: null,
  readerState: null,
  flowType: null,
}

const reducer = (
  state = initialState,
  action: ReturnType<
    | typeof setAusweisInteractionDetails
    | typeof setAusweisScannerKey
    | typeof setAusweisReaderState
    | typeof setAusweisFlowType
  >,
) => {
  switch (action.type) {
    case AusweisActionType.setDetails:
      return { ...state, details: action.payload }
    case AusweisActionType.setScannerKey:
      return { ...state, scannerKey: action.payload }
    case AusweisActionType.setReaderState:
      return { ...state, readerState: action.payload }
    case AusweisActionType.setFlowType:
      return { ...state, flowType: action.payload }
    default:
      return state
  }
}

export default reducer
