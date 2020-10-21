import partiallyAppliedAction from '~/utils/partiallyAppliedActions'
import { DeviceAuthActions } from './deviceAuthTypes'

export const setBiometryType = partiallyAppliedAction(
  DeviceAuthActions.setBiometryType,
)
export const showBiometry = partiallyAppliedAction(
  DeviceAuthActions.showBiometry,
)
