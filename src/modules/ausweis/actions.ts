import createAction from '~/utils/createAction'
import {
  AusweisModuleActions,
  SetAusweisDetailsAction,
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
