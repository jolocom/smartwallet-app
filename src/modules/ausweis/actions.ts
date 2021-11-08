import createAction from '~/utils/createAction'
import {
  AusweisModuleActions,
  SetAusweisDetailsAction,
  SetAusweisScannerKeyAction,
} from './types'

export const setAusweisDetails = createAction<
  SetAusweisDetailsAction['payload']
>(AusweisModuleActions.setDetails)

export const setAusweisScannerKey = createAction<
  SetAusweisScannerKeyAction['payload']
>(AusweisModuleActions.setScannerKey)
