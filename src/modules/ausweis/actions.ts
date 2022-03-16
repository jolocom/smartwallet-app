import createAction from '~/utils/createAction'
import { AusweisAction, AusweisActions, AusweisActionType } from './types'

// To avoid manually passing a generic type every time we call `createAction`
// redeclaring createAction fn with types specific to the `ausweis` module
function createAusweisAction<K extends keyof AusweisActions>(type: K) {
  return createAction<AusweisAction<K>>(type)
}

export const setAusweisInteractionDetails = createAusweisAction(
  AusweisActionType.setDetails,
)

export const setAusweisScannerKey = createAusweisAction(
  AusweisActionType.setScannerKey,
)

export const setAusweisReaderState = createAusweisAction(
  AusweisActionType.setReaderState,
)
