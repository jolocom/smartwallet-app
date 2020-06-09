import { BIOMETRY_TYPE } from 'react-native-keychain'

export enum DeviceAuthActions {
  setBiometryType,
  showBiometry,
}

export type BiometryTypes = BIOMETRY_TYPE | 'FACE' | 'IRIS' | null

export interface StateI {
  biometryType: BiometryTypes
  isPasscodeView: boolean
}

export interface ActionI {
  type: DeviceAuthActions
  payload?: any
}
