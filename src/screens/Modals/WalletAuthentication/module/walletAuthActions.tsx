import partiallyAppliedAction from '~/utils/partiallyAppliedActions'
import { WalletAuthActions } from './walletAuthTypes'

export const setBiometryType = partiallyAppliedAction(
  WalletAuthActions.setBiometryType,
)
export const showBiometry = partiallyAppliedAction(
  WalletAuthActions.showBiometry,
)
