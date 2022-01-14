import createAction from '~/utils/createAction'
import {
  AusweisModuleActions,
  SetAusweisDetailsAction,
  SetAusweisFlowTypeAction,
  SetAusweisReaderStateAction,
  SetAusweisScannerKeyAction,
} from './types'

export const setAusweisInteractionDetails = createAction<
  SetAusweisDetailsAction['payload']
>(AusweisModuleActions.setDetails)

export const setAusweisScannerKey = createAction<
  SetAusweisScannerKeyAction['payload']
>(AusweisModuleActions.setScannerKey)

export const setAusweisReaderState = createAction<
  SetAusweisReaderStateAction['payload']
>(AusweisModuleActions.setReaderState)

export const setAusweisFlowType = createAction<
  SetAusweisFlowTypeAction['payload']
>(AusweisModuleActions.setFlowType)
